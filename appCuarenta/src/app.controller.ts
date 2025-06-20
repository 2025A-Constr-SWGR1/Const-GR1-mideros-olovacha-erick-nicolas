import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToIndex(@Res() res: Response) {
    res.redirect('/index.html');
  }
}
