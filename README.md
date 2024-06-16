# node-initdb

node-initdb is a CLI tool for initializing database configurations and structures in Node.js projects.

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

- For Sequelize: `sequelize`, `mysql2`, `body-parser`, `cors`, `dotenv`
- For MongoDB: `mongoose`, `body-parser`, `cors`, `dotenv`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- MohamedAshraf
- GitHub: [Your GitHub Profile](https://github.com/MohamedAshraf701)
