import { Injectable } from '@nestjs/common';
import { RRule, RRuleSet, rrulestr, Weekday, Frequency, Options, ByWeekday } from 'rrule';

// Export types for convenience
export type { Frequency, Options, ByWeekday } from 'rrule';

@Injectable()
export class RRuleService {
  // Direct access to all rrule exports
  public readonly RRule = RRule;
  public readonly RRuleSet = RRuleSet;
  public readonly rrulestr = rrulestr;
  
  // Frequency constants
  public readonly YEARLY = RRule.YEARLY;
  public readonly MONTHLY = RRule.MONTHLY;
  public readonly WEEKLY = RRule.WEEKLY;
  public readonly DAILY = RRule.DAILY;
  public readonly HOURLY = RRule.HOURLY;
  public readonly MINUTELY = RRule.MINUTELY;
  public readonly SECONDLY = RRule.SECONDLY;
  
  // Weekday constants
  public readonly MO = RRule.MO;
  public readonly TU = RRule.TU;
  public readonly WE = RRule.WE;
  public readonly TH = RRule.TH;
  public readonly FR = RRule.FR;
  public readonly SA = RRule.SA;
  public readonly SU = RRule.SU;
  
  // Weekday class
  public readonly Weekday = Weekday;

  /**
   * Create a new RRule instance - convenience method
   */
  createRule(options: Partial<Options> & { freq: Frequency }): RRule {
    return new RRule(options);
  }

  /**
   * Create a new RRuleSet instance - convenience method
   */
  createRuleSet(cache = false): RRuleSet {
    return new RRuleSet(cache);
  }

  /**
   * Parse an RFC string into RRule/RRuleSet - convenience method
   */
  fromString(rfcString: string, options?: any): RRule | RRuleSet {
    return rrulestr(rfcString, options);
  }

  /**
   * Get all occurrences for a rule - convenience method
   */
  getAllOccurrences(rule: RRule, limit?: number): Date[] {
    return rule.all((date, len) => limit ? len < limit : true);
  }

  /**
   * Get occurrences between two dates - convenience method
   */
  getOccurrencesBetween(rule: RRule, after: Date, before: Date, inc = false): Date[] {
    return rule.between(after, before, inc);
  }

  /**
   * Get the next occurrence after a given date - convenience method
   */
  getNextOccurrence(rule: RRule, after: Date, inc = false): Date | null {
    return rule.after(after, inc);
  }

  /**
   * Get the previous occurrence before a given date - convenience method
   */
  getPreviousOccurrence(rule: RRule, before: Date, inc = false): Date | null {
    return rule.before(before, inc);
  }

  /**
   * Get a limited number of occurrences starting from a date - convenience method
   */
  getOccurrences(rule: RRule, count: number, startDate?: Date): Date[] {
    if (startDate) {
      const allAfterStart = rule.all().filter(date => date >= startDate);
      return allAfterStart.slice(0, count);
    }
    
    return rule.all((date, len) => len < count);
  }
}