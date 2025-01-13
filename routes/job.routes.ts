import express, { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const router = express.Router();

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().min(1, "Salary is required"),
  description: z.string().min(1, "Description is required"),
});

const validateJob = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = jobSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

router.post("/", validateJob, async (req, res) => {
  const { title, company, location, salary, description } = req.body;

  try {
    const newJob = await prisma.job.create({
      data: { title, company, location, salary, description },
    });
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Error creating job posting" });
  }
});

router.get("/", async (_, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Error retrieving job postings" });
  }
});

router.get("/latest", async (_, res) => {
  try {
    console.log("hi");
    const latestJobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    res.status(200).json(latestJobs);
  } catch (error) {
    console.error("Latest jobs error:", error);
    res.status(500).json({ error: "Error retrieving latest job postings" });
  }
});

router.get("/search", async (req, res) => {
  const { title, company, location } = req.query;

  try {
    const jobs = await prisma.$queryRaw`
      SELECT * FROM Job 
      WHERE (${
        title
          ? Prisma.sql`LOWER(title) LIKE LOWER(${`%${title}%`})`
          : Prisma.sql`1=1`
      })
      AND (${
        company
          ? Prisma.sql`LOWER(company) LIKE LOWER(${`%${company}%`})`
          : Prisma.sql`1=1`
      })
      AND (${
        location
          ? Prisma.sql`LOWER(location) LIKE LOWER(${`%${location}%`})`
          : Prisma.sql`1=1`
      })
      ORDER BY createdAt DESC
    `;

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Error searching for jobs" });
  }
});

router.get("/filters", async (req, res) => {
  const { salary, location } = req.query;

  try {
    const jobs = await prisma.$queryRaw`
      SELECT * FROM Job 
      WHERE (${
        salary
          ? Prisma.sql`LOWER(salary) LIKE LOWER(${`%${salary}%`})`
          : Prisma.sql`1=1`
      })
      AND (${
        location
          ? Prisma.sql`LOWER(location) LIKE LOWER(${`%${location}%`})`
          : Prisma.sql`1=1`
      })
      ORDER BY createdAt DESC
    `;

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ error: "Error filtering jobs" });
  }
});

router.get("/stats", async (_, res) => {
  try {
    const jobCount = await prisma.job.count();
    const recentJobs = await prisma.job.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    res.status(200).json({
      totalJobs: jobCount,
      recentJobs,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Error fetching job statistics" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error("Fetch single error:", error);
    res.status(500).json({ error: "Error retrieving job posting" });
  }
});

router.put("/:id", validateJob, async (req, res) => {
  const { id } = req.params;
  const { title, company, location, salary, description } = req.body;

  try {
    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: { title, company, location, salary, description },
    });
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Error updating job posting" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.job.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Error deleting job posting" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Patch error:", error);
    res.status(500).json({ error: "Error partially updating job posting" });
  }
});

export default router;
