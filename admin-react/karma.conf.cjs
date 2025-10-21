// karma.conf.cjs
process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: [
      { pattern: "test/contacto.spec.js", watched: false },
      { pattern: "test/panel-solicitudes.spec.jsx", watched: false, type: "module" },
      { pattern: "test/DetallePedidoPanel.spec.jsx", watched: false, type: "module" },
      { pattern: "test/PedidosPanel.spec.jsx", watched: false, type: "module" },
      { pattern: "test/EditarProductoPanel.spec.jsx", watched: false, type: "module" },
      { pattern: "test/NuevoProductoPanel.spec.jsx", watched: false, type: "module" },
      { pattern: "test/ProductosPanelSmoke.spec.jsx", watched: false, type: "module" },
      { pattern: "test/ProductosPocoStockPanel.spec.jsx", watched: false, type: "module" },
      { pattern: "test/ReportesPanel.spec.js", watched: false, type: "module" },
      { pattern: "public/img/**/*", watched: false, included: false, served: true },
    ],

    proxies: {
      "/img/": "/base/public/img/",
    },

    exclude: [],

    preprocessors: {
      "test/contacto.spec.js": ["esbuild"],
      "test/panel-solicitudes.spec.jsx": ["esbuild"],
      "test/DetallePedidoPanel.spec.jsx": ["esbuild"],
      "test/PedidosPanel.spec.jsx": ["esbuild"],
      "test/EditarProductoPanel.spec.jsx": ["esbuild"],
      "test/NuevoProductoPanel.spec.jsx": ["esbuild"],
      "test/ProductosPanelSmoke.spec.jsx": ["esbuild"],
      "test/ProductosPocoStockPanel.spec.jsx": ["esbuild"],
      "test/ReportesPanel.spec.js": ["esbuild"],
    },

    esbuild: {
      sourcemap: "inline",
      target: "es2018",
      jsx: "automatic",
      loader: { ".js": "jsx", ".jsx": "jsx" },
    },

    reporters: ["progress"],
    browsers: ["ChromeHeadlessCustom"],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-dev-shm-usage",
        ],
      },
    },

    singleRun: true,
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-esbuild"),
    ],
    logLevel: config.LOG_INFO,
  });
};
