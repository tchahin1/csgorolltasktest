import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  rootHc() {
    return { ok: true };
  }

  @Get('/api')
  rootApiHc() {
    return { ok: true };
  }
}
