import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import { IData, IPath, IDirectory, IDirectoryChildren } from "@/common/types";
import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { logger } from "@/server";

export const fileService = {
  retrieveAndMapResults: async (): Promise<
    ServiceResponse<IDirectory | null>
  > => {
    try {
      const response = await fetch(process.env.FILES_ORIGIN as string);
      const data: IData = (await response.json()) as IData;
      const serviceResponse = fileService.mapResults(data);

      if (!data) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No Files found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<IDirectory>(
        ResponseStatus.Success,
        "Files retrieved successfully",
        serviceResponse,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
  mapResults: (data: IData) => {
    const paths: IPath[] = data?.items;
    const ipAddress: string = paths?.[0]?.["fileUrl"]
      ?.split(":")[1]
      .replace("//", "");
    const mappedResult: IDirectory = {
      [ipAddress]: [],
    };
    const directoryTree: IDirectory | [] = mappedResult[ipAddress];

    paths.forEach((path: IPath) => {
      const pathSegments = path["fileUrl"]
        .split("/")
        .splice(3, 3)
        .filter((el: string) => el);

      let currentDirectory: IDirectoryChildren[] | undefined = directoryTree;

      pathSegments.forEach((segment: string, index: number) => {
        const isFile: boolean =
          pathSegments.length != 1 &&
          index === pathSegments.length - 1 &&
          segment.indexOf(".") != -1;

        if (!currentDirectory?.some((item: any) => item.name === segment)) {
          const newPath = isFile ? segment : { name: segment, children: [] };
          currentDirectory?.push(newPath as any);
        }

        currentDirectory = isFile
          ? currentDirectory
          : currentDirectory?.find((item: any) => item.name === segment)
              ?.children;
      });
    });

    const transformTreeStructure = (tree: any) => {
      return tree.map((node: any) => {
        if (node.children) {
          const newNode: any = {
            [node.name]: transformTreeStructure(node.children),
          };
          return newNode;
        }
        return node;
      });
    };

    const treeStructure = transformTreeStructure(directoryTree);

    mappedResult[ipAddress] = treeStructure;
    return mappedResult;
  },
};
