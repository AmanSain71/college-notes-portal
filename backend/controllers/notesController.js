const { PutCommand, ScanCommand, DeleteCommand, UpdateCommand, } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = require("../config/dynamodb");
const uploadToS3 = require("../utils/uploadToS3");

const uploadNote = async (req, res) => {
   console.log(req.body);
  try {
    const {
      title,
      subject,
      semester,
      branch,
      description,
    } = req.body;

    if (!title || !subject || !semester || !branch || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file",
      });
    }

    // Upload to S3
    const uploadedFile = await uploadToS3(req.file);

    const note = {
      noteId: uuidv4(),
      title,
      subject,
      semester,
      branch,
      description,
      uploadedBy: req.user.email,
      fileName: req.file.originalname,
      s3Key: uploadedFile.key,
      s3Url: uploadedFile.url,
      uploadedAt: new Date().toISOString(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
    );

    res.status(201).json({
      message: "Note Uploaded Successfully",
      note,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    res.json(data.Items);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyNotes = async (req, res) => {
  try {
    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    const myNotes = data.Items.filter(
      (note) => note.uploadedBy === req.user.email
    );

    res.json(myNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Get all notes
    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    // Find requested note
    const note = data.Items.find((item) => item.noteId === noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Check ownership
    if (note.uploadedBy !== req.user.email) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // Delete from DynamoDB
    await dynamoDB.send(
      new DeleteCommand({
        TableName: process.env.NOTES_TABLE,
        Key: {
          noteId,
        },
      })
    );

    res.json({
      message: "Note deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    const note = data.Items.find((item) => item.noteId === noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.uploadedBy !== req.user.email) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.json(note);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const {
      title,
      subject,
      semester,
      branch,
      description,
    } = req.body;

    // Get all notes
    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    const note = data.Items.find((item) => item.noteId === noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.uploadedBy !== req.user.email) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await dynamoDB.send(
      new UpdateCommand({
        TableName: process.env.NOTES_TABLE,
        Key: {
          noteId,
        },
        UpdateExpression:
          "set title = :t, subject = :s, semester = :sem, branch = :b, description = :d",
        ExpressionAttributeValues: {
          ":t": title,
          ":s": subject,
          ":sem": semester,
          ":b": branch,
          ":d": description,
        },
      })
    );

    res.json({
      message: "Note updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const downloadNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const data = await dynamoDB.send(
      new ScanCommand({
        TableName: process.env.NOTES_TABLE,
      })
    );

    const note = data.Items.find((item) => item.noteId === noteId);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      fileName: note.fileName,
      downloadUrl: note.s3Url,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  uploadNote,
  getAllNotes,
  getMyNotes,
  getNoteById,
  deleteNote,
  updateNote,
  downloadNote,
};