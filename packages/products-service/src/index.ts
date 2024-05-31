import { WorkerEntrypoint, RpcTarget } from 'cloudflare:workers';

export interface Product {
	id: string;
	name: string;
}

export class Example extends RpcTarget {
	#products: Product[] = [
		{ id: "351ca594", name: "Book 1" },
		{ id: "5ecb29f1", name: "Book 2" },
		{ id: "291ba5ea", name: "Book 3" },
	];

	async add(product: Product) {
		this.#products.push(product);
		return this.products();
	}

	async remove(id: string) {
		this.#products = this.#products.filter((product) => product.id !== id);
		return this.products();
	}

	async modify(id: string, product: Product) {
		this.#products = this.#products.filter((product) => product.id !== id);
		this.#products.push(product);
		return this.products();
	}

	async product(id: string) {
		return this.#products.filter((product) => product.id === id)[0] ?? null;
	}

	async products() {
		return this.#products;
	}
}

export default class ProductService extends WorkerEntrypoint {
	async init() {
		return new Example();
	}
	async fetch() {
		return new Response("Test from here");
	}
}
