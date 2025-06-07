import Task from "../model/Task.model.js";
import XLSX from "xlsx";
import { Readable } from "stream";
import SubMain from "../model/SubMain.model.js";
import Main from "../model/Main.model.js";
import { log } from "console";

export const createTask = async (req, res) => {
  try {
    const task = req.body;
    const userId = req._id;

    const submain = await SubMain.findById({ _id: task.submainId });
    if (!submain)
      return res
        .status(404)
        .json({ message: `No Sub Main Website With This ID : ${task.submainId}` });

    const newtask = new Task({
      ...task,
      userId: userId,
    });
    const savedtask = await newtask.save();
    res.status(201).json({
      message: "Task created successfully",
      task: savedtask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks.length == 0)
      return res.status(404).json({ message: `No Tasks Available !` });

    res.status(200).json({
      message: "Tasks Is Available",
      total: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available` });

    res.status(200).json({
      message: `This Task Is Available`,
      task: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const newtask = req.body;
    const data = await Task.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Task is not available" });
    }

    data.submainId = newtask.submainId || data.submainId;
    data.username = newtask.username || data.username;
    data.date = newtask.date || data.date;
    data.tasks = newtask.tasks || data.tasks;
    data.remainingWork = newtask.remainingWork || data.remainingWork;
    data.number = newtask.number || data.number;
    data.notes = newtask.notes || data.notes;
    await data.save();
    res.status(200).json({
      message: "task updated successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteTaskByID = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task)
      return res.status(404).json({ message: `This Task Is Not Available !` });

    res.status(200).json({
      message: `Task Is Available`,
      deletedTask: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getTasksBySubMainId = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ submainId: id })
    
    if (tasks.length === 0) {
      return res.status(404).json({ message: `No tasks found for Sub Main ID: ${id}` });
    }

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}





export const printTasks = async (req, res) => {
  try {
    const { subMainId } = req.params;
    console.log(`Generating Excel for SubMain ID: ${subMainId}`);

    // Fetch tasks filtered by submainId, no population
    const tasks = await Task.find({ submainId: subMainId }).lean();

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this SubMain ID" });
    }

    // Map data to export only relevant fields from Tasks model
    const data = tasks.map((task) => ({
      "اسم الموظف": task.username || "",
      التاريخ: task.date ? new Date(task.date).toLocaleDateString("ar-EG") : "",
      المهام: task.tasks || "",
      "العمل المتبقي": task.remainingWork || "",
      الملاحظات: task.notes || "",
      الرقم: task.number !== undefined ? task.number : "",
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Write workbook to buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Length", buffer.length);

    // Stream the buffer
    const readable = Readable.from(buffer);
    readable.pipe(res);

    console.log("Excel file generated and sent successfully");
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSubMainName = async (req, res)=>{
  try {
    const {id} = req.params
    const name = await SubMain.findById(id)
    if (! name )
      return res.status(400).json({message :  'No Name'})

    res.status(200).json({
      data : name.name
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export const getMainName = async (req, res) => {
  try {
    const { id } = req.params; // id is Sub Main ID

    // 1. Find the SubMain entry
    const subMain = await SubMain.findById(id);
    if (!subMain) {
      return res.status(404).json({ message: "No Sub Main found with this ID" });
    }

    // 2. Find the Main entry using subMain.mainId
    const main = await Main.findById(subMain.mainId);
    if (!main) {
      return res.status(404).json({ message: "No Main found for the provided Sub Main" });
    }

    // 3. Return the Main name or full Main data
    res.status(200).json({
      message: "Main Website is available",
      data: {
        mainName: main.name, // or `main.title`, based on your schema
        mainId: main._id
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

