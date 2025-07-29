import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RRuleModule, RRuleService } from '../src';

@Module({
  imports: [RRuleModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rruleService = app.get(RRuleService);

  console.log('=== NestJS RRule Wrapper Examples ===\n');

  // Example 1: Daily recurrence using service constants
  console.log('1. Daily recurrence (every day for 5 days):');
  const dailyRule = rruleService.createRule({
    freq: rruleService.DAILY,
    interval: 1,
    count: 5
  });
  const dailyOccurrences = rruleService.getAllOccurrences(dailyRule);
  dailyOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  // Example 2: Weekly recurrence using direct RRule access
  console.log('\n2. Weekly recurrence (Mon, Wed, Fri for 4 weeks) - Direct RRule:');
  const weeklyRule = new rruleService.RRule({
    freq: rruleService.WEEKLY,
    interval: 1,
    byweekday: [rruleService.MO, rruleService.WE, rruleService.FR],
    count: 12
  });
  const weeklyOccurrences = weeklyRule.all();
  weeklyOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  // Example 3: Monthly recurrence with advanced weekday
  console.log('\n3. Monthly recurrence (first Monday of each month):');
  const firstMonday = new rruleService.Weekday(0, 1); // Monday (0) first occurrence (1)
  const monthlyRule = rruleService.createRule({
    freq: rruleService.MONTHLY,
    byweekday: [firstMonday],
    count: 6
  });
  const monthlyOccurrences = rruleService.getAllOccurrences(monthlyRule);
  monthlyOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  // Example 4: Using RRuleSet for complex rules
  console.log('\n4. Complex rule using RRuleSet:');
  const ruleSet = rruleService.createRuleSet();
  
  // Add a daily rule
  const dailySetRule = rruleService.createRule({
    freq: rruleService.DAILY,
    count: 10
  });
  ruleSet.rrule(dailySetRule);
  
  // Exclude weekends
  const weekendExclusion = rruleService.createRule({
    freq: rruleService.YEARLY,
    byweekday: [rruleService.SA, rruleService.SU]
  });
  ruleSet.exrule(weekendExclusion);
  
  const complexOccurrences = Array.from(ruleSet as any).slice(0, 5) as Date[]; // First 5
  complexOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  // Example 5: Parsing RFC strings
  console.log('\n5. Parsing RFC strings:');
  const rfcString = 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=4';
  const parsedRule = rruleService.fromString(rfcString) as any;
  const parsedOccurrences = parsedRule.all();
  console.log(`   Parsed rule created ${parsedOccurrences.length} occurrences`);
  parsedOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  // Example 6: All rrule methods available
  console.log('\n6. Using all available rrule methods:');
  const testRule = rruleService.createRule({
    freq: rruleService.DAILY,
    count: 10
  });
  
  console.log(`   Rule count: ${testRule.count()}`);
  console.log(`   Rule as string: ${testRule.toString()}`);
  
  const now = new Date();
  const nextOccurrence = testRule.after(now);
  console.log(`   Next occurrence: ${nextOccurrence?.toDateString()}`);
  
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const between = testRule.between(tomorrow, dayAfter);
  console.log(`   Occurrences in date range: ${between.length}`);

  // Example 7: Direct access to all rrule functionality
  console.log('\n7. Direct access example - Last Friday of the month:');
  const lastFriday = new rruleService.Weekday(4, -1); // Friday (4) last occurrence (-1)
  const lastFridayRule = new rruleService.RRule({
    freq: rruleService.MONTHLY,
    byweekday: [lastFriday],
    count: 3
  });
  const lastFridayOccurrences = lastFridayRule.all();
  lastFridayOccurrences.forEach((date, i) => {
    console.log(`   ${i + 1}. ${date.toDateString()}`);
  });

  await app.close();
}

if (require.main === module) {
  bootstrap().catch(console.error);
}