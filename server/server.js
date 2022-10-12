const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(
		'mongodb+srv://nguyendong:nguyendong47@cluster0.hr9qn.mongodb.net/?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('DB Connection Successful');
	})
	.catch((err) => {
		console.log(err.message);
	});

app.use('/api/user', userRoutes);

const host = '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, function () {
	console.log('Server started.......');
});
