export default {
  created() {
    this.$axios.defaults.headers.common.Authorization = `Bearer ${this.$q.localStorage.getItem(
      "JWT-token"
    )}`;
  },
  methods: {
    ajaxCallback(data, request, success, error) {
      if (data.code === 1) {
        if ("message" in data) {
          this.$q.notify({
            type: "positive",
            message: data.message
          });
        }

        if (success) {
          success();
        }
      } else if (data.code === 2) {
        this.refreshToken(request);
      } else {
        this.$q.notify({
          type: "negative",
          message: data.message
        });
        if (error) {
          error();
        }
        if (data.code === -1) {
          this.$q.localStorage.remove("JWT-token");
          this.$router.replace("/auth/login");
        }
      }
    },
    refreshToken(request) {
      this.$axios
        .post(
          "/api/public/refreshToken",
          {
            reqtype: "user",
            token: this.$q.localStorage.getItem("JWT-token")
          },
          {
            headers: {
              Authorization: `Bearer ${this.$q.localStorage.getItem(
                "JWT-Refresh-token"
              )}`
            }
          }
        )
        .then(r => {
          switch (r.data.code) {
            case 1:
              console.log(r);
              this.$q.localStorage.set("JWT-token", r.data.token);
              this.$axios.defaults.headers.common.Authorization = `Bearer ${this.$q.localStorage.getItem(
                "JWT-token"
              )}`;
              request();
              break;
            case -1:
              this.$q.notify({
                type: "negative",
                message: r.data.message
              });
              this.$q.localStorage.remove("JWT-token");
              this.$q.localStorage.remove("JWT-Refresh-token");
              this.$router.replace("/auth/login");
              break;
            case 0:
              this.$q.notify({
                type: "negative",
                message: r.data.message
              });
              this.$q.localStorage.remove("JWT-token");
              this.$q.localStorage.remove("JWT-Refresh-token");
              this.$router.replace("/auth/login");
              break;
          }
        });
    }
  }
};
