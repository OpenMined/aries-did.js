import app from './app/app';

import 'module-alias/register';

// console.log(process.env);
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT);
