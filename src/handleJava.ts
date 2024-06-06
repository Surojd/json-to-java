import { javaClassBody, javaClass, javaAttribute } from "./types";
import { pascalCase, camelCase, addTabPrefix as t, addNewLinePostfix as n } from "./helper";
import { workspace } from "vscode";
let all = workspace.getConfiguration();
const lombok = all.get('json2java.lombok');

const writeJavaClass = (javaClass: javaClass): javaClassBody => {
  let body = "";

  body += `package ${javaClass.packageName}; \n\n`;
  if (lombok) {
    body += `import lombok.Data;\n\n`;
    body += `@Data\n`;
  }
  body += n(`public class ${pascalCase(javaClass.name)} {`);

  //attributes
  javaClass.attributes.forEach(attribute => {
    body += t(n(`private ${handleJavaClassType(attribute)} ${camelCase(attribute.name)};`));
  });

  body += n("");
  if (!lombok) {
    //constructor
    body += t(n(`public ${pascalCase(javaClass.name)}() {`));
    body += n("");
    body += t(n(`}`));

    body += n("");

    //getter
    javaClass.attributes.forEach(attribute => {
      body += t(n(`public get${pascalCase(attribute.name)}() {`));
      body += t(t(n(`return this.${camelCase(attribute.name)};`)));
      body += t(n(n(`}`)));
    });

    //setter
    javaClass.attributes.forEach(attribute => {
      body += t(n(`public set${pascalCase(attribute.name)}(${handleJavaClassType(attribute)} value) {`));
      body += t(t(n(`this.${camelCase(attribute.name)} = value;`)));
      body += t(n(n(`}`)));
    });
  }
  body += `}`;

  return { name: pascalCase(javaClass.name), textBody: body };
};

const handleJavaClassType = (attribute: javaAttribute) => {
  const attributeType = (attribute.type === "object") ?
    pascalCase(attribute.name) :
    attribute.type;

  return attribute.list ? `List<${attributeType}>` : attributeType;
};

export default writeJavaClass;