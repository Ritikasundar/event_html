const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/eventsDB')
.then(()=>{
    console.log('connected to mongodb');
})
.catch((err)=>{
    console.log('error'+err);
})

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const eventSchema = mongoose.Schema({
    name:String,
    date:Date,
    location:String,
    description:String
});

const Event = mongoose.model('Event',eventSchema);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
});


app.post('/add-event',async (req,res)=>{
    const {name,date,location,description} = req.body;

    try{
        const newEvent = new Event({
            name,date,location,description
        });

        await newEvent.save();
        res.status(201).json({message:'event added successfully'})
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get('/get-events', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});

// DELETE route to remove an event by id
app.delete('/delete-event/:id', async (req, res) => {
    const { id } = req.params;  // Corrected here, changed from "Id" to "id"
  
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);  // Corrected here, changed from "Club" to "Event"
  
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});



app.listen(port,()=>{
    console.log('listening');
})