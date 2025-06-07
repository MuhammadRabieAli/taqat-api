import Kader from "../model/Kader.model.js";
import SubMain from "../model/SubMain.model.js";

export const createKader = async (req, res) => {
  try {
    const { submainId, name, tasks } = req.body;

    // Check if the submainId exists
    const subMain = await SubMain.findById(submainId);
    if (!subMain) {
      return res.status(404).json({ message: "SubMain not found" });
    }

    // Create a new Kader
    const newKader = new Kader({
      submainId,
      name,
      tasks,
    });

    await newKader.save();
    res.status(201).json(newKader);
  } catch (error) {
    console.error("Error creating Kader:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllKaders = async (req, res) => {
  try {
    const kaders = await Kader.find();
    if (kaders.length == 0) {
      return res.status(404).json({ message: "No Kaders found" });
    }
    res.status(200).json({data : kaders});
  } catch (error) {
    console.error("Error fetching Kaders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getKaderById = async (req, res) => {
  try {
    const { id } = req.params;
    const kader = await Kader.findById(id);
    if (!kader)
      return res.status(404).json({ message: `No Kader with this ID : ${id}` });

    res.status(200).josn({
      data: kader,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error : ${error}` });
  }
};

export const updateKader = async (req, res) => {
  try {
    const newdata = req.body;
    const data = await Kader.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data is not available" });
    }

    data.submainId = newdata.submainId || data.submainId;
    data.name = newdata.name || data.name;
    data.tasks = newdata.tasks || data.tasks;
    await data.save();
    res.status(200).json({
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteKader = async (req , res )=>{
     try {
    const { id } = req.params;
    const data = await Kader.findByIdAndDelete(id);
    if (!data)
      return res.status(404).json({ message: "Data is not available" });

    res.status(200).json({
      message: "Data is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}