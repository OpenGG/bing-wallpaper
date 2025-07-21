import { exec } from "child_process";

export class ImageService {
  async validateImage(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(`identify -verbose ${filePath}`, (error, stdout, stderr) => {
        if (error) {
          if (error.message.includes("command not found")) {
            console.error(
              "Fatal: `identify` command not found. Please install ImageMagick.",
            );
          } else {
            console.error(
              "An unexpected error occurred while validating image:",
              error,
            );
          }
          return reject(error);
        }

        if (stderr) {
          console.error(
            "ImageMagick `identify` command failed:",
            stderr,
          );
          return resolve(false);
        }

        if (stdout.toLowerCase().includes("corrupt")) {
          console.warn("ImageMagick found corruption in the image.");
          return resolve(false);
        }

        resolve(true);
      });
    });
  }
}
