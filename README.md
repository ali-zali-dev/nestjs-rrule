# NestJS RRule Wrapper

A comprehensive NestJS module wrapper for [rrule](https://github.com/jakubroztocil/rrule), providing an easy way to work with recurrence rules in your NestJS applications.

## Features

- 🎯 **NestJS Native**: Built as a proper NestJS module with dependency injection
- 📅 **Complete RRule Support**: Full support for all rrule functionality
- 🔧 **TypeScript**: Fully typed with TypeScript interfaces
- 🧪 **Well Tested**: Comprehensive test suite included
- 📚 **Helper Methods**: Convenient methods for common recurrence patterns
- 🔄 **RFC Compliant**: Support for RFC 5545 recurrence rule strings

## Installation

Install directly from GitHub:

```bash
npm install git+https://github.com/ali-zali-dev/nestjs-rrule.git
```

or

```bash
yarn add git+https://github.com/ali-zali-dev/nestjs-rrule.git
```

> **Note:** This package is currently available via GitHub. An npm package will be published soon. The `rrule` dependency is automatically installed.

## Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { RRuleModule } from 'nestjs-rrule';

@Module({
  imports: [RRuleModule],
})
export class AppModule {}
```

### 2. Inject the Service

```typescript
import { Injectable } from '@nestjs/common';
import { RRuleService } from 'nestjs-rrule';

@Injectable()
export class MyService {
  constructor(private readonly rruleService: RRuleService) {}

  createMeetingSchedule() {
    // Method 1: Using convenience method
    const rule = this.rruleService.createRule({
      freq: this.rruleService.WEEKLY,
      interval: 1,
      byweekday: [this.rruleService.MO, this.rruleService.TU, this.rruleService.WE, this.rruleService.TH, this.rruleService.FR],
      count: 10
    });

    // Method 2: Using direct RRule access (full rrule power)
    const directRule = new this.rruleService.RRule({
      freq: this.rruleService.WEEKLY,
      interval: 1,
      byweekday: [this.rruleService.MO, this.rruleService.TU, this.rruleService.WE, this.rruleService.TH, this.rruleService.FR],
      count: 10
    });

    return this.rruleService.getAllOccurrences(rule);
  }
}
```

## API Reference

### RRuleService Properties

#### Direct Access to All RRule Classes and Constants

The service provides direct access to all rrule functionality:

- `RRule` - The main RRule class
- `RRuleSet` - Class for complex recurrence setups
- `rrulestr` - Function to parse RFC strings
- `Weekday` - Weekday class for advanced usage

#### Frequency Constants

- `YEARLY`, `MONTHLY`, `WEEKLY`, `DAILY`, `HOURLY`, `MINUTELY`, `SECONDLY`

#### Weekday Constants

- `MO`, `TU`, `WE`, `TH`, `FR`, `SA`, `SU`

### Convenience Methods

- `createRule(options: Options): RRule` - Create a custom recurrence rule
- `createRuleSet(cache?: boolean): RRuleSet` - Create a new RRuleSet
- `fromString(rfcString: string, options?: any): RRule | RRuleSet` - Parse RFC string
- `getAllOccurrences(rule: RRule, limit?): Date[]` - Get all occurrences
- `getOccurrencesBetween(rule: RRule, after: Date, before: Date, inc?): Date[]` - Get occurrences in date range
- `getNextOccurrence(rule: RRule, after: Date, inc?): Date | null` - Get next occurrence
- `getPreviousOccurrence(rule: RRule, before: Date, inc?): Date | null` - Get previous occurrence
- `getOccurrences(rule: RRule, count: number, startDate?): Date[]` - Get limited occurrences

## Examples

### Daily Meetings

```typescript
// Every day for 2 weeks
const dailyRule = this.rruleService.createRule({
  freq: this.rruleService.DAILY,
  interval: 1,
  count: 14
});
const meetings = this.rruleService.getAllOccurrences(dailyRule);
```

### Weekly Team Standup

```typescript
// Every Monday, Wednesday, Friday
const standupRule = this.rruleService.createRule({
  freq: this.rruleService.WEEKLY,
  interval: 1,
  byweekday: [this.rruleService.MO, this.rruleService.WE, this.rruleService.FR],
  count: 20
});
const standups = this.rruleService.getAllOccurrences(standupRule);
```

### Monthly Reports (First Monday of Each Month)

```typescript
// First Monday of every month for a year
const firstMonday = new this.rruleService.Weekday(0, 1); // Monday (0) first occurrence (1)
const reportRule = this.rruleService.createRule({
  freq: this.rruleService.MONTHLY,
  byweekday: [firstMonday],
  count: 12
});
const reportDates = this.rruleService.getAllOccurrences(reportRule);
```

### Custom Complex Rule with RRuleSet

```typescript
// Complex rule: Daily meetings, but exclude weekends and holidays
const ruleSet = this.rruleService.createRuleSet();

// Add daily rule
const dailyRule = this.rruleService.createRule({
  freq: this.rruleService.DAILY,
  count: 30
});
ruleSet.rrule(dailyRule);

// Exclude weekends
const weekendExclusion = this.rruleService.createRule({
  freq: this.rruleService.YEARLY,
  byweekday: [this.rruleService.SA, this.rruleService.SU]
});
ruleSet.exrule(weekendExclusion);

// Exclude specific holiday
ruleSet.exdate(new Date('2024-12-25')); // Christmas

const meetingDates = Array.from(ruleSet);
```

### Direct RRule Usage (Full Power)

```typescript
// Use all rrule methods directly
const rule = new this.rruleService.RRule({
  freq: this.rruleService.DAILY,
  interval: 1
});

// All rrule methods are available
const count = rule.count();
const all = rule.all();
const next = rule.after(new Date());
const between = rule.between(new Date('2024-01-01'), new Date('2024-01-31'));

// Iterator support
for (const date of rule) {
  console.log(date);
  break; // Don't run forever
}
```

### RFC Strings

```typescript
// Create from RFC string
const rule = this.rruleService.fromString('FREQ=DAILY;COUNT=10');

// Using rrulestr directly
const directRule = this.rruleService.rrulestr('FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=6');

// Convert to RFC string (works with any RRule instance)
const ruleString = rule.toString();
console.log(ruleString); // "FREQ=DAILY;COUNT=10"
```

## Testing

```bash
npm test
```

## Running the Example

```bash
npx ts-node examples/usage.ts
```

## Key Features

- **Complete RRule Access**: Direct access to all rrule classes (`RRule`, `RRuleSet`, `rrulestr`)
- **All Constants Available**: All frequency and weekday constants accessible through the service
- **Type Safety**: Full TypeScript support with all rrule types exported
- **Convenience Methods**: Helper methods for common operations while maintaining full access
- **Advanced Features**: Support for `RRuleSet`, complex rules, exclusions, and all rrule features
- **RFC Compliant**: Full support for RFC 5545 recurrence rule parsing and generation

## Advanced Usage

### Complex Scheduling with RRuleSet

```typescript
const ruleSet = this.rruleService.createRuleSet();

// Every weekday
ruleSet.rrule(new this.rruleService.RRule({
  freq: this.rruleService.WEEKLY,
  byweekday: [this.rruleService.MO, this.rruleService.TU, this.rruleService.WE, this.rruleService.TH, this.rruleService.FR]
}));

// Add specific dates
ruleSet.rdate(new Date('2024-12-24')); // Christmas Eve

// Exclude holidays
ruleSet.exdate(new Date('2024-12-25')); // Christmas
```

### Using Weekday with Positions

```typescript
// Last Friday of every month
const lastFriday = new this.rruleService.Weekday(4, -1); // Friday (4) last occurrence (-1)
const lastFridayRule = new this.rruleService.RRule({
  freq: this.rruleService.MONTHLY,
  byweekday: [lastFriday]
});

// Second Tuesday of every month
const secondTuesday = new this.rruleService.Weekday(1, 2); // Tuesday (1) second occurrence (2)
const secondTuesdayRule = new this.rruleService.RRule({
  freq: this.rruleService.MONTHLY,
  byweekday: [secondTuesday]
});
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
