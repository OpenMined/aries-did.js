import { readdir, readFile } from 'fs';
import { AgentController } from 'src/app/agent/agent.model';

export const readSchema = (path: string, agentController: AgentController) => {
  readdir(path, (err, items) => {
    const schemas: JSON[] = [];
    for (let item of items) {
      let itmPath = `${path}\\${item}`;
      readFile(itmPath, (err, data) => {
        schemas.push(JSON.parse(data.toString()));
        agentController.addSchema(JSON.parse(data.toString())).then(res => {});
      });
    }
  });
  return agentController;
};
