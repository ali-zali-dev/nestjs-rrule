import { Module } from '@nestjs/common';
import { RRuleService } from './rrule.service';

@Module({
  providers: [RRuleService],
  exports: [RRuleService],
})
export class RRuleModule {} 