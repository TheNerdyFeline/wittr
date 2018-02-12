import idb from 'idb';

let dbPromise = idb.open('test-db', 3, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      let keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put('world', 'hello');
    case 1:
      upgradeDb.createObjectStore('people', {keyPath: 'name'});
    case 2:
      let peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'faveAnimal');
  }
});

dbPromise.then(function(db) {
  let tx = db.transaction('keyval');
  let keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

dbPromise.then(function(db) {
  let tx = db.transaction('keyval', 'readwrite');
  let keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
}).catch(function(err) {
  console.log(err);
});

dbPromise.then(function(db) {
  // TODO: in the keyval store, set
  // "favoriteAnimal" to your favourite animal
  // eg "cat" or "dog"
  let tx = db.transaction('keyval', 'readwrite');
  let keyValStore = tx.objectStore('keyval');
  keyValStore.put('tiger', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added faveAnimal:tiger to keyval');
}).catch(function(err) {
  console.log(err);
});

dbPromise.then(function(db) {
  let tx = db.transaction('people', 'readwrite');
  let peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    faveAnimal: 'dog'
  });
    
  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    faveAnimal: 'cat'
  });
  
  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    faveAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    faveAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('Added people to people');
}).catch(function(err) {
  console.log(err);
});

dbPromise.then(function(db) {
  let tx = db.transaction('people');
  let peopleStore = tx.objectStore('people');
  let animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('People: ', people);
}).catch(function(err) {
  console.log(err);
});
