import { Hono } from 'hono'
import { z } from "zod"
import { zValidator } from '@hono/zod-validator'
import type { ProductService, Example } from "@app-name/products-service"

const app = new Hono<{
	Bindings: {
		WORKER: Service<ProductService>;
	};
	Variables: {
		productService: Example
	}
}>()

app.use(async (c, next) => {
	const productService = await c.env.WORKER.init() as unknown as Example;
	c.set("productService", productService)
	await next()
})

app.get('/', async (c) => {
	const productService = c.var.productService;
	const products = await productService.products();
	return c.json(products)
})

app.get('/:id', async (c) => {
	const productService = c.var.productService;
	const id = c.req.param("id");
	const product = await productService.product(id);
	if (!product) {
		c.status(404)
	}
	return c.json(product)
})

app.post('/', zValidator(
	"form",
	z.object({
		id: z.string(),
		name: z.string(),
	})
),
	async (c) => {
		const productService = c.var.productService;
		const product = c.req.valid("form");
		const result = await productService.add(product);
		return c.json(result)
	})

app.put('/:id', zValidator(
	"form",
	z.object({
		id: z.string(),
		name: z.string(),
	})
),
	async (c) => {
		const productService = c.var.productService;
		const id = c.req.param("id");
		const product = c.req.valid("form");
		const result = await productService.modify(id, product);
		return c.json(result)
	})

app.delete('/:id',
	async (c) => {
		const productService = c.var.productService;
		const id = c.req.param("id");
		const result = await productService.remove(id);
		return c.json(result)
	})

export default app
