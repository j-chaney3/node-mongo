const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations');

//const url = 'mongodb://localhost:27017/';
//idk why, but this only works with specified url below
const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'nucampsite';

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
	assert.strictEqual(err, null);

	console.log('Connected correctly to server');

	const db = client.db(dbname);

	//just for clean testing purposes, obv wouldn't drop actual collection
	db.dropCollection('campsites', (err, result) => {
		assert.strictEqual(err, null);
		console.log('Dropped Collection', result);

		//4 params (db, insert, collection, callback), callback called after inserting documents
		dboper.insertDocument(
			db,
			{ name: 'Breadcrumb Trail Campground', description: 'Test' },
			'campsites',
			//callback
			(result) => {
				console.log('Insert Document:', result.ops);
				//
				dboper.findDocuments(db, 'campsites', (docs) => {
					console.log('Found Documents: ', docs);
					//find field in the db, with name and information to update, collection name, with a callback to log the number of results modified
					dboper.updateDocument(
						db,
						{ name: 'Breadcrumb Trail Campground' },
						{ description: 'Updated Test Description' },
						'campsites',
						//callback
						(result) => {
							console.log(
								console.log('Updated Document Count:', result.result.nModified)
							);
							dboper.findDocuments(db, 'campsites', (docs) => {
								console.log('Found Documents: ', docs);
								dboper.removeDocument(
									db,
									{ name: 'Breadcrumb Trail Campground' },
									'campsites',
									//callback
									(result) => {
										console.log(
											'Deleted Document Count: ',
											result.deletedCount
										);
										client.close();
									}
								);
							});
						}
					);
				});
			}
		);
	});
});
