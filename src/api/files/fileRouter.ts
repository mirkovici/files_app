import express, { Request, Response, Router } from "express";
import { fileService } from "@/api/files/fileService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export const fileRouter: Router = (() => {
  const router = express.Router();

  router.get("/files", async (_req: Request, res: Response) => {
    const serviceResponse = await fileService.retrieveAndMapResults();
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
