
import { Entry } from "../models/entry.js"

export const addEntry = async(req,res,next)=>{
   try {
    const {
        amount,
        category,
        subcategory,
        type,
        paymentMethod,
        date,
        description

    } = req.body;

    if (!amount || !category || !type || !paymentMethod || !date) {
        return res.status(400).json({ message: 'Amount, category, type, payment method, and date are required.' });
      }

      const newEntry = new Entry({
        amount,
        category,
        subcategory,
        type,
        paymentMethod,
        date,
        description,
      });

      const savedEntry = await newEntry.save();
      res.status(201).json({
        message: 'Entry created successfully',
        entry: savedEntry
      });


   } catch (error) {
    next(error);
   }
};


export const getAllEntries = async(req,res,next)=>{
    try {
        const filters = req.query;
        const entries = await Entry.find(filters);
        res.status(200).json({
            message: 'All entries retrieved successfully',
            entries,
        })
    } catch (error) {
        next(error);
    }
};

export const getIncomeEntities = async(req,res,next)=>{
    try {
        const incomeEntries = await Entry.find({ type: 'Income' });
        res.status(200).json({
            message: 'Income entries retrieved successfully',
            incomeEntries,
        });
      } catch (err) {
        next(err);
      }
}

export const getAllExpense = async(req,res,next)=>{
    try {
        const expenseEntries = await Entry.find({type:'Expense'});
        res.status(200).json({
            message: 'Expense entries retrieved successfully',
            expenseEntries,
        });
    } catch (error) {
        next(error);
    }
}



export const editEntries = async (req, res) => {
    const { id } = req.params; // Get ID from request parameters
    const updatedData = req.body; // Get updated data from the request body

    try {
        // Assuming you have a Mongoose model called 'Entry'
        const updatedEntry = await Entry.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(200).json(updatedEntry);
    } catch (error) {
        next(error);
    }
};


export const deleteEntries = async(req,res,next)=>{
    try{
        const deleteEntry = await Entry.findByIdAndDelete(req.params.id);
        if(!deleteEntry){
            return res.status(404).json({message: 'Entry not found.'});
        }
        res.status(200).json({message: 'Entry deleted successfully'});

    }
    catch(err){
        next(err);
    }
}