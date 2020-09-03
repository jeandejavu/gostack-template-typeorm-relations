import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(
    { body: { name, email } }: Request,
    response: Response,
  ): Promise<Response> {
    const service = await container.resolve(CreateCustomerService);
    const customer = await service.execute({ name, email });
    return response.json(customer);
  }
}
