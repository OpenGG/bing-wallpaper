export class ImageService {
  async validateImage(filePath: string): Promise<boolean> {
    try {
      const command = new Deno.Command("identify", {
        args: ["-verbose", filePath],
        stdout: "piped",
        stderr: "piped",
      });
      const { code, stdout, stderr } = await command.output();
      const output = new TextDecoder().decode(stdout);

      if (code !== 0) {
        console.error(
          "ImageMagick `identify` command failed:",
          new TextDecoder().decode(stderr),
        );
        return false;
      }

      if (output.toLowerCase().includes("corrupt")) {
        console.warn("ImageMagick found corruption in the image.");
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.error(
          "Fatal: `identify` command not found. Please install ImageMagick.",
        );
      } else {
        console.error(
          "An unexpected error occurred while validating image:",
          error,
        );
      }
      throw error; // 抛出错误以中止整个过程
    }
  }
}
