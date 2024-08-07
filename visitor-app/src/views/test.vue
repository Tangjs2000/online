<template>

</template>

<script>


import {URLProcess} from "../stores/tool/CustomTool";

export default {
  name: "test",
  mounted() {
    let accessUrl = window.location.href;
    let parseRes = URLProcess.parse(accessUrl);
    console.log("parseRes：", parseRes);
    let baseUrl = "http://localhost:9527/";
    let params = {"aa": "aa1", "bbb": ["bbb1","bbb2"]};
    let buildRes = URLProcess.build(baseUrl, params);
    console.log("buildRes：", buildRes);
  }
}
</script>

<style scoped>

</style>