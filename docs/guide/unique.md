# Unique Values

In general, Faker methods do not return unique values.

```ts
faker.seed(55);
faker.animal.type(); //'cat'
faker.animal.type(); //'bird'
faker.animal.type(); //'horse'
faker.animal.type(); //'horse'
```

Some methods and locales use much smaller data sets than others. For example, `faker.animal.type` has only 44 possible animals to choose from. In contrast, `faker.person.fullName()` pulls from a list of hundreds of first names, surnames, and prefixes/suffixes, so it can generate hundreds of thousands of unique names. Even then, the [birthday paradox](https://en.wikipedia.org/wiki/Birthday_Paradox) means that duplicate values will quickly be generated.

Sometimes, you want to generate unique values. For example, you may wish to have unique values in a database email column.  
There are a few possible strategies for this:

1. Use `faker.helpers.uniqueArray()` if you want to generate all the values at one time. For example:

```ts
faker.helpers.uniqueArray(faker.internet.email, 1000); // will generate 1000 unique email addresses
```

2. If there are insufficient values for your needs, consider prefixing or suffixing values with your own sequential values, for example you could prefix `1.`, `2.` to each generated email in turn.

3. Build your own logic to keep track of a set of previously generated values and regenerate values as necessary if a duplicate is generated

4. Use a third-party package to enforce uniqueness, such as [enforce-unique](https://github.com/MansurAliKoroglu/enforce-unique) or [@dpaskhin/unique](https://github.com/dPaskhin/unique).
