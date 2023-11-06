<template>
  <div>
    <nav class="navbar navbar-expand bg-body-secondary">
      <div class="container-md container-fluid">
        <a
          class="navbar-brand mb-0 h1"
          href="#"
        >Tiny Markdown Server</a>
      </div>
    </nav>

    <div class="container-md mt-3">
      <form>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': formErrors.includes('directory') }"
            v-model="directory"
          >
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click.prevent="selectDirectory"
          >Browse</button>
        </div>
        <div class="input-group mb-3">
          <span class="input-group-text">http://localhost:</span>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': formErrors.includes('port') }"
            v-model="port"
          >
          <span class="input-group-text">/</span>
        </div>
        <div class="mb-3">
          <button
            type="button"
            class="btn btn-primary me-3"
            @click.prevent="start"
          >Start</button>
          <button
            type="button"
            class="btn btn-secondary me-3"
            @click.prevent="stop"
          >Stop</button>
          <span>{{ serverStatus }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      directory: '',
      port: '',

      formErrors: [],

      serverStatus: '',
      timeoutId: null,
    };
  },

  mounted() {
    window.myAPI.serverStarted(() => {
      this.showStatus('server started.');
    });
    window.myAPI.serverStopped(() => {
      this.showStatus('server stopped.');
    });
  },

  methods: {
    selectDirectory() {
      window.myAPI.dialog((filePath) => {
        if (typeof filePath === 'string') {
          this.directory = filePath;
        }
      });
    },
    start() {
      this.hideStatus();
      this.formErrors = [];

      const validationResult = myAPI.validateForm(this.directory, this.port);

      if (validationResult.isValid) {
        window.myAPI.serverStart(this.directory, this.port);
      } else {
        this.formErrors = validationResult.errors;
      }
    },
    stop() {
      window.myAPI.serverStop();
    },
    showStatus(message) {
      this.serverStatus = message;

      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId);
      }

      this.timeoutId = window.setTimeout(() => {
        this.timeoutId = null;
        this.hideStatus();
      }, 3000);
    },
    hideStatus() {
      this.serverStatus = '';
    },
  },
};
</script>
