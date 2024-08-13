<template>
  <div id="custom-textarea" ref="custom-textarea" class="textarea" contenteditable="true"
       :value="modelValue" :placeholder="placeholder">
  </div>
</template>

<script>
export default {
  name: "customTextarea",
  props: {
    ref: {
      type: String,
      default: "custom-textarea",
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入......"
    }
  },
  data() {
    return {}
  },
  watch: {
    "modelValue": {
      deep: true,
      handler: function (val, oldVal) {
        // this.$emit('update:modelValue', val);
      }
    }
  },
  mounted() {
    let that = this;
    this.$refs["custom-textarea"]
        .addEventListener('input', function (event) {
          that.$emit('update:modelValue', this.innerText);
          /* 输入类型 */
          /*switch (event.inputType) {
            case "insertCompositionText": {
              /!* 键盘输入事件 *!/
              /!*if (!event.data) this.innerHTML = null;
              else {
                if (!event.isComposing)
                  this.innerHTML += event.data;
              }*!/
              break;
            }
            case "deleteContentBackward": {
              /!* 键盘回退事件 *!/
              /!*this.innerHTML = this.innerHTML.toString().substr(0,
                  this.innerHTML.toString().length ? this.innerHTML.toString().length - 1 : 0);*!/
              break;
            }
            default: {

            }
          }*/
        });
  }
}
</script>

<style scoped>
.textarea {
  width: 100%;
  /*height: 100%;*/
  overflow: auto;
  word-wrap: break-word;
}

.textarea[contenteditable] {
  border: 1px solid #ccc;
  padding: 1px 1px 0 1px;
}

.textarea::after {
  content: attr(placeholder);
  color: grey;
  pointer-events: none; /* 使文本不受鼠标事件影响 */
  display: none; /* 使文本占据空间 */
}

.textarea:empty::after {
  display: block; /* 当div为空时显示占位符 */
}
</style>