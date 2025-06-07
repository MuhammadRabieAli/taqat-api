import express from 'express';
import mongoose from 'mongoose';


const KaderSchema = new mongoose.Schema({
    submainId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubMain',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    tasks: {
        type: String,
        required: true,
        trim: true
    },
    
} , {
    timestamps: true,
    collection: 'kader'
});

const Kader = mongoose.model('Kader', KaderSchema);
export default Kader;