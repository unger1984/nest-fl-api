import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import puppeteer from 'puppeteer';
import moment from 'moment';
import { Op } from 'sequelize';

import Category from '../category/category.entity';
import Project from '../project/project.entity';
import { ProjectDto } from '../project/project.dto';
import { flStrip, fltoDate } from '../utils';

@Injectable()
export class ParserService implements OnApplicationBootstrap {
	private proxyList: string[] = [];
	private usedProxy: string | null | undefined = null;
	private skipCounter = 0;

	constructor(
		@Inject('Sequelize') private readonly sequelize,
		@Inject('CategoryRepository') private readonly categoryRepository: typeof Category,
		@Inject('ProjectRepository') private readonly projectRepository: typeof Project,
	) {}

	onApplicationBootstrap() {
		setTimeout(() => this.parse(), 15 * 1000);
	}

	private async parse() {
		const args = ['--no-sandbox'];
		try {
			if (this.proxyList.length <= 0) {
				this.proxyList = await this.getProxy();
			}
			if (this.proxyList.length > 0) {
				if (!this.usedProxy || this.skipCounter > 10) {
					this.usedProxy = this.proxyList.pop();
					args.push(`--proxy-server=${this.usedProxy}`);
				} else if (this.usedProxy) {
					args.push(`--proxy-server=${this.usedProxy}`);
				}
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log('not use proxy', err);
		}

		// eslint-disable-next-line no-console
		console.log('use', args);

		const __start = Date.now();
		let browser = null;
		let pPosts = [];
		let page = null;
		let hidden = 0;
		try {
			browser = await puppeteer.launch({ args: args });
			page = await browser.newPage();
			await page.setViewport({ width: 1280, height: 920 });
			await page.setExtraHTTPHeaders({
				'Upgrade-Insecure-Requests': '1',
				Referer: 'https://www.fl.ru/projects/?kind=1',
			});
			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
			);
			await page.goto('https://www.fl.ru/projects/?kind=1');
			const hideButton = await page.$('#hide_top_project_lnk');
			if (hideButton) {
				await hideButton.click();
			}

			hidden = 0;

			pPosts = await page.$$('.b-post:not(.topprjpay)');
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			this.usedProxy = null;
			if (browser) {
				await browser.close();
			}
			setTimeout(() => this.parse(), 1000);
		}

		let projectCounter = 0;
		if (pPosts && pPosts.length > hidden) {
			for (let index = hidden; index < pPosts.length; index++) {
				try {
					const id = ((await (await pPosts[index].getProperty('id')).jsonValue()) as string).replace(
						'project-item',
						'',
					);

					const alink = await pPosts[index].$('h2 > a');
					const priceDiv = await pPosts[index].$('.b-post__price');

					const project: ProjectDto = {
						flId: id,
						link: alink ? ((await (await alink.getProperty('href')).jsonValue()) as string) : '',
						title: alink ? ((await (await alink.getProperty('innerText')).jsonValue()) as string) : '',
						price: priceDiv
							? ((await (await priceDiv.getProperty('innerText')).jsonValue()) as string)
							: null,
						text: null,
						categoryId: null,
						date: null,
					};

					page = await browser.newPage();
					await page.setViewport({ width: 1280, height: 920 });
					await page.setExtraHTTPHeaders({
						'Upgrade-Insecure-Requests': '1',
						Referer: 'https://www.fl.ru/projects/?kind=1',
					});
					await page.setUserAgent(
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
					);
					await page.goto(project.link);

					const divText = await page.$(`#projectp${id}`);
					if (divText) {
						const text = ((await (await divText.getProperty('innerHTML')).jsonValue()) as string).trim();
						project.text = flStrip(text);
					}

					const categoryes = [];
					let aCategoryes = await page.$$(
						'.b-layout__txt.b-layout__txt_fontsize_11.b-layout__txt_padbot_20 > a',
					);
					if (!aCategoryes || aCategoryes.length <= 0) {
						aCategoryes = await page.$$('.b-layout__txt.b-layout__txt_fontsize_11 > a');
					}
					for (const jkey in aCategoryes) {
						const catText = ((await (
							await aCategoryes[jkey].getProperty('innerText')
						).jsonValue()) as string).trim();
						if (catText) {
							categoryes.push(catText);
						}
					}
					const category = await this.saveCategoryes(categoryes);
					if (category) {
						project.categoryId = category.id;
					}

					project.date = fltoDate(
						(await (
							await (
								await page.$$(
									'.b-layout__txt.b-layout__txt_padbot_30 > .b-layout__txt.b-layout__txt_fontsize_11',
								)
							)[1].getProperty('innerText')
						).jsonValue()) as string,
					);

					const sproject = await this.projectRepository.create(project);
					await sproject.save();
					// eslint-disable-next-line no-console
					console.log('project', index, id);
					projectCounter++;
				} catch (err) {
					if (err.name && err.name === 'SequelizeUniqueConstraintError') {
						// eslint-disable-next-line no-console
						console.error('BREAK');
						break;
					}
					// eslint-disable-next-line no-console
					console.error(err.toString(), err);
				}
			}
		}
		if (browser) {
			await browser.close();
		}
		if (projectCounter <= 0) {
			this.skipCounter++;
		}

		// удалим все старое
		this.projectRepository.destroy({ where: { date: { [Op.lte]: moment().subtract(2, 'days') } } });

		const __ms = Date.now() - __start;
		// eslint-disable-next-line no-console
		console.log(`Time work - ${__ms}ms`);
		setTimeout(() => this.parse(), 15 * 1000);
	}

	private async saveCategoryes(categoryes: string[]): Promise<Category | null> {
		if (categoryes.length > 0) {
			let parent = await this.categoryRepository.findOne({ where: { title: categoryes[0] } });
			if (!parent) {
				parent = await this.categoryRepository.create({ title: categoryes[0] });
				await parent.save();
			}
			if (categoryes.length > 1) {
				let child = await this.categoryRepository.findOne({
					where: { parentId: parent.id, title: categoryes[1] },
				});
				if (!child) {
					child = await this.categoryRepository.create({ title: categoryes[1], parentId: parent.id });
					await child.save();
				}
				return child;
			}
			return parent;
		}
		return null;
	}

	private async getProxy(): Promise<string[]> {
		let browser = null;
		let page = null;
		const res = [];
		try {
			browser = await puppeteer.launch({ args: ['--no-sandbox'] });
			page = await browser.newPage();
			await page.setViewport({ width: 1280, height: 920 });
			await page.setExtraHTTPHeaders({
				'Upgrade-Insecure-Requests': '1',
				Referer: 'https://hidemyna.me/',
			});
			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
			);
			await page.goto('https://hidemyna.me/ru/proxy-list/?maxtime=700&type=s#list');
			// await page.screenshot({path: '/tmp/test.png'});
			await page.waitFor(1000 * 15);
			// await page.screenshot({path: 'screenshots/test.png'});
			const table = await page.$('div.table_block table');
			if (table) {
				const trs = await table.$$('tr');
				for (const index in trs) {
					const tr = trs[index];
					const tds = await tr.$$('td');
					// console.log("cols",tds.length)
					if (tds.length <= 0) {
						continue;
					}
					const ip: string = (await (await tds[0].getProperty('innerText')).jsonValue()) as string;
					const port: string = (await (await tds[1].getProperty('innerText')).jsonValue()) as string;
					if (ip && port) {
						if (ip.toLowerCase() === 'ip адрес' || isNaN(parseInt(port))) {
							continue;
						}
						res.push(`${ip}:${port}`);
					}
				}
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			throw err;
		}
		if (browser) {
			await browser.close();
		}
		return res;
	}
}
