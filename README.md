# EHR Lite

A lightweight electronic health record system.

## Deployment

The frontend can be compiled with the following command:

```bash
cd front
npm run build
```

The compiled files will be in `build` directory. Deploy them to a static HTTP server.

The backend can be started with the following command:

```bash
cd server
pip install -r requirements.txt
python run.py
```

## Development

The frontend has a development server with support of hot module replacement (HMR). To start it, run:

```bash
npm run start
```

And visit: http://localhost:5000/

