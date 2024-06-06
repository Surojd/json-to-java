import { Uri, workspace } from "vscode";
import { openJsonFile, writeJavaClasses } from "./io";

export const main = (filePath: Uri, outputPath: Uri) => {
  const dirPath = outputPath.fsPath;
  let packageName = 'com.example.demo';
  if (dirPath.includes("src\\main\\java")) {
    const dirs = dirPath.split("src\\main\\java");
    packageName = dirs[1].replace(/\\/g, '.').substring(1);
  }
  const javaClasses = openJsonFile(filePath.fsPath, packageName);
  if (javaClasses) {
    writeJavaClasses(javaClasses, outputPath.fsPath);
  }
};
