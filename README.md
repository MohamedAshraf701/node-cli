# node-initdb

node-initdb is a CLI tool for initializing database configurations and structures in Node.js projects.


![Node InitDB Plugin Demo](https://github.com/MohamedAshraf701/node-cli/blob/main/example.gif)


## Installation

You can install node-initdb globally using npm:

```bash
npm install -g node-initdb
```

## Usage

To use node-initdb, navigate to your project directory and run one of the following commands based on your database choice:

### Initialize Sequelize Structure

To set up Sequelize with default folders, files, and install necessary packages:

```bash
node-initdb --seque
```

### Initialize MongoDB Structure

To set up MongoDB with default folders, files, and install necessary packages:

```bash
node-initdb --mongo
```

Replace `--seque` or `--mongo` with your choice of database setup.

## Folder Structure

After running the command, node-initdb will create the following folder structure:

```
- config/
- Controllers/
- Routes/
- Models/
- uploads/
- Utils/
```

## Files Created

node-initdb creates essential files such as controller, route, model files, and configuration files necessary for setting up your chosen database.

## Dependencies

node-initdb installs the following dependencies based on your database setup:

- For Sequelize: `sequelize`, `mysql2`
- For MongoDB: `mongoose`
- Middleware and Utilities: `express`, `body-parser`, `cors`, `dotenv`, `fs`, `http-errors`, `https`, `jsonwebtoken`, `multer`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Get in touch

If you have any questions, feel free to reach out:

- Email: ashrafchauhan567@gmail.com
- Githube: [@MohamedAshraf701](https://github.com/MohamedAshraf701)

# Support
<p><a href="https://www.buymeacoffee.com/ashraf704"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="ashraf704" /></a></p><br><br>
