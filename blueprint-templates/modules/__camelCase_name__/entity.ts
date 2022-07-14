import moment from "moment";

class {{pascalCase name}}Entity {
  //copy props from backend:
  createdAt: string = "";
  constructor({{camelCase name}}:any) {
    if(!{{camelCase name}}) return ;
    Object.assign(this, {{camelCase name}});
    // convert entity type here
    this.createdAt = {{camelCase name}}.createdAt? moment({{camelCase name}}.createdAt).format("DD/MM/YYYY"):"";
  }
  static createList{{pascalCase name}}(list{{pascalCase name}}:Array<any>){
    if (!Array.isArray(list{{pascalCase name}})) return [];
    return list{{pascalCase name}}.map(({{camelCase name}}:{{pascalCase name}}Entity) => {
      return new {{pascalCase name}}Entity({{camelCase name}});
    });
  }
}
export default {{pascalCase name}}Entity;
