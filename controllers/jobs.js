const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

// @desc get all jobs
// @route /api/v1/jobs
// @access Private
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort(
        "createdAt"
    );
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

// @desc create a new job
// @route /api/v1/jobs
// @access Private
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

// @desc get a single job
// @route /api/v1/jobs/:id
// @access Private
const getSingleJob = async (req, res) => {
    const userId = req.user.userId;
    const jobId = req.params.id;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });

    if (!job) {
        throw new NotFoundError(`No job found with id: ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

// @desc update a job
// @route /api/v1/jobs/:id
// @access Private
const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req;

    if (company === "" || position === "") {
        throw new BadRequestError("Company or Position fields cannot be empty");
    }
    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ job });
};

// @desc delete a job
// @route /api/v1/jobs/:id
// @access Private
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob,
};
