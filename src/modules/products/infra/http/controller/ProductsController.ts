import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(
    { body: { name, price, quantity } }: Request,
    response: Response,
  ): Promise<Response> {
    const service = await container.resolve(CreateProductService);
    const product = await service.execute({ name, price, quantity });
    return response.json(product);
  }
}
