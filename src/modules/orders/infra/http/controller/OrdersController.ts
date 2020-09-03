import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(
    { params: { id } }: Request,
    response: Response,
  ): Promise<Response> {
    const service = await container.resolve(FindOrderService);
    const order = await service.execute({ id });
    return response.json(order);
  }

  public async create(
    { body: { customer_id, products } }: Request,
    response: Response,
  ): Promise<Response> {
    const service = await container.resolve(CreateOrderService);
    const order = await service.execute({ customer_id, products });
    return response.json(order);
  }
}
