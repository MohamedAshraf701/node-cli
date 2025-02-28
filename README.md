# node-initdb

node-initdb is a CLI tool for initializing project configurations and structures in Node.js projects. **It now requires you to select a database, a web framework, and a language (JavaScript or TypeScript) for the tool to work.** In addition to setting up your chosen database and framework, node-initdb now supports file upload functionality and JWT-based authentication.

![Node InitDB Plugin Demo](https://github.com/MohamedAshraf701/node-cli/blob/main/example.gif)

## Installation

Install node-initdb globally using npm:

```bash
npm install -g node-initdb
```

## Usage

Navigate to your project directory and run node-initdb with the appropriate options. **You must choose one option each for:**

- **Database:**  
  - MongoDB: `--mongo` or `-m`
  - Sequelize: `--seque` or `-s`

- **Web Framework:**  
  - Express: `--express` or `-e`
  - Fastify: `--fastify` or `-f`

- **Language:**  
  - JavaScript: `--javascript` or `-j`
  - TypeScript: `--typescript` or `-t`

**Important:** All three categories (database, framework, and language) are required. If any one is missing, node-initdb will not run.

Optionally, you can add `--yes` (or `-y`) to skip interactive prompts and use default values.

### Examples

- **MongoDB, Express, and TypeScript:**

  ```bash
  node-initdb --mongo --express --typescript
  # or shorthand:
  node-initdb -m -e -t
  ```

- **Sequelize, Fastify, and JavaScript:**

  ```bash
  node-initdb --seque --fastify --javascript
  # or shorthand:
  node-initdb -s -f -j
  ```

### Add Module Task

To add a new module using `node-add`, run:

```bash
node-add <moduleName> [options]
```

Replace `<moduleName>` with your desired module name. Use the same options for database, framework, and language:

- Database: `-m` / `--mongo`, `-s` / `--seque`
- Framework: `-e` / `--express`, `-f` / `--fastify`
- Language: `-j` / `--javascript`, `-t` / `--typescript`

#### Example

```bash
node-add "user" -m -e -t
```

## Folder Structure

After running node-initdb, your project will have the following structure:

```
- config/
- Controllers/
- Routes/
- Models/
- Middleware/
- uploads/
- Utils/
```

## Files Created

node-initdb creates essential files such as controllers, routes, models, configuration files, and middleware. In addition, the setup includes:

- **File Upload:** Pre-configured file upload functionality.
- **JWT Authentication:** Setup for JWT-based authentication.

## Dependencies

Depending on your chosen configuration, node-initdb installs the following dependencies:

- **Database:**
  - **MongoDB:** `mongoose`
  - **Sequelize:** `sequelize`, `mysql2`
- **Web Framework:**
  - **Express:** `express`
  - **Fastify:** `fastify`
- **New Features:**
  - **File Upload:** `multer`
  - **JWT Authentication:** `jsonwebtoken`

## Contributing

Contributions are welcome! Fork the repository, implement your changes, and submit a pull request. Please follow the existing coding style and guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Get in Touch

For questions or support, feel free to reach out:

- **Email:** ashrafchauhan567@gmail.com
- **GitHub:** [@MohamedAshraf701](https://github.com/MohamedAshraf701)

## Support

If you find node-initdb useful, please consider supporting the project:

<p>
  <a href="https://www.buymeacoffee.com/ashraf704">
    <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="ashraf704" />
  </a>
</p>