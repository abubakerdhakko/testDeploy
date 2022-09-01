<template>
  <div class="overlay-spinner">
    <img src="assets/loader/medium.gif" alt="loader" class="loaders" />
  </div>
</template>

<script>
export default {
  name: "name",

  components: {},

  data() {
    return {};
  },

  methods: {},

  created() {},

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.loaders {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
.overlay-spinner {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.25);
}
</style>