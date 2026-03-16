const Supplier = require("../models/Supplier");


// ADD SUPPLIER
const createSupplier = async (req,res)=>{

  try{

    const supplier = new Supplier(req.body);

    await supplier.save();

    res.status(201).json({
      message:"Supplier added successfully",
      supplier
    });

  }catch(error){

    res.status(500).json({
      message:"Server error",
      error:error.message
    });

  }

};



// GET ALL SUPPLIERS
const getSuppliers = async (req,res)=>{

  try{

    const suppliers = await Supplier.find();

    res.json(suppliers);

  }catch(error){

    res.status(500).json({
      message:"Server error"
    });

  }

};

module.exports = {createSupplier,getSuppliers};