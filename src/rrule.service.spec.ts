import { Test, TestingModule } from '@nestjs/testing';
import { RRuleService } from './rrule.service';

describe('RRuleService', () => {
  let service: RRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RRuleService],
    }).compile();

    service = module.get<RRuleService>(RRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should provide access to all rrule constants', () => {
    expect(service.DAILY).toBeDefined();
    expect(service.WEEKLY).toBeDefined();
    expect(service.MONTHLY).toBeDefined();
    expect(service.YEARLY).toBeDefined();
    expect(service.MO).toBeDefined();
    expect(service.TU).toBeDefined();
    expect(service.WE).toBeDefined();
  });

  it('should provide access to RRule class', () => {
    expect(service.RRule).toBeDefined();
    expect(typeof service.RRule).toBe('function');
  });

  it('should provide access to RRuleSet class', () => {
    expect(service.RRuleSet).toBeDefined();
    expect(typeof service.RRuleSet).toBe('function');
  });

  it('should create a daily rule using convenience method', () => {
    const rule = service.createRule({
      freq: service.DAILY,
      interval: 1,
      count: 5
    });
    expect(rule).toBeInstanceOf(service.RRule);
    expect(rule.options.freq).toBe(service.DAILY);
    expect(rule.options.interval).toBe(1);
    expect(rule.options.count).toBe(5);
  });

  it('should create a daily rule using direct RRule access', () => {
    const rule = new service.RRule({
      freq: service.DAILY,
      interval: 1,
      count: 5
    });
    expect(rule).toBeInstanceOf(service.RRule);
    expect(rule.options.freq).toBe(service.DAILY);
  });

  it('should create a weekly rule', () => {
    const rule = service.createRule({
      freq: service.WEEKLY,
      interval: 1,
      byweekday: [service.MO, service.WE, service.FR],
      count: 10
    });
    expect(rule).toBeInstanceOf(service.RRule);
    expect(rule.options.freq).toBe(service.WEEKLY);
    expect(rule.options.byweekday).toEqual([0, 2, 4]); // Monday, Wednesday, Friday
  });

  it('should create and use RRuleSet', () => {
    const ruleSet = service.createRuleSet();
    expect(ruleSet).toBeInstanceOf(service.RRuleSet);
    
    const rule1 = service.createRule({
      freq: service.DAILY,
      count: 3
    });
    
    ruleSet.rrule(rule1);
    
    // RRuleSet has a count() method to verify it works
    expect(ruleSet.count()).toBe(3);
    
    // Get occurrences using between method
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const occurrences = ruleSet.between(now, future);
    expect(occurrences.length).toBeGreaterThan(0);
  });

  it('should get all occurrences with limit', () => {
    const rule = service.createRule({
      freq: service.DAILY,
      interval: 1,
      count: 3
    });
    const occurrences = service.getAllOccurrences(rule);
    expect(occurrences).toHaveLength(3);
  });

  it('should get next occurrence', () => {
    const rule = service.createRule({
      freq: service.DAILY,
      interval: 1
    });
    const now = new Date();
    const next = service.getNextOccurrence(rule, now);
    expect(next).toBeInstanceOf(Date);
    expect(next!.getTime()).toBeGreaterThan(now.getTime());
  });

  it('should parse RFC strings', () => {
    const ruleString = 'FREQ=DAILY;COUNT=5';
    const parsedRule = service.fromString(ruleString);
    expect(parsedRule).toBeInstanceOf(service.RRule);
  });

  it('should get occurrences between dates', () => {
    const rule = service.createRule({
      freq: service.DAILY,
      interval: 1
    });
    const start = new Date();
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    
    const occurrences = service.getOccurrencesBetween(rule, start, end);
    expect(Array.isArray(occurrences)).toBe(true);
  });

  it('should work with advanced weekday usage', () => {
    // First Monday of each month using nth() method
    const firstMonday = new service.Weekday(0, 1); // Monday (0) first occurrence (1)
    const rule = service.createRule({
      freq: service.MONTHLY,
      byweekday: [firstMonday],
      count: 6
    });
    
    const occurrences = service.getAllOccurrences(rule);
    expect(occurrences).toHaveLength(6);
    
    // Verify all occurrences are Mondays
    occurrences.forEach(date => {
      expect(date.getDay()).toBe(1); // Monday
    });
  });
}); 