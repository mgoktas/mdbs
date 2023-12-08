import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = <YOUR-MONGO-DB-URI>";
export const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("mdbs").collection("travels");
  client.close();
});
