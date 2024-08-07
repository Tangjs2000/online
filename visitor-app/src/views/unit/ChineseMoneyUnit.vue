<template>
  <div class="content-bar">
    <div>
      <div class="title">人民币大写转换在线工具</div>
      <!-- 小写金额输入栏 -->
      <div class="amount-column">
        <el-input
            v-model="tranAmount.tobe"
            :formatter="(value) => formatAmount(value)"
            :parser="(value) => parserAmount(value)"
            placeholder="请输入0.01 至 999,999,999,999.99合法值"
            style="width: 600px;">
          <template #prepend>￥</template>
        </el-input>
        <el-button type="success" @click="TranAmount(this.tranAmount.tobe)" style="width: 100px">转换</el-button>
      </div>
      <!-- 注释信息：annotation -->
      <p style="width: 700px; font-size: 18px;">
        <span style="color:#ff0000;width: 36px">注：</span>
        <span style="color:#ff0000;">1. 请输入 0.01 至 999,999,999,999.99 合法值</span><br/>
        <span style="color:#ff0000;padding-left: 36px">2. 点击复制转换内容</span>
      </p>
      <!-- 大写金额转换结果 -->
      <div style="width: 700px;font-size: 25px;margin-top: 20px">
        <span>人民币：</span>
        <span @click="copy(this.tranAmount.final)" class="tran-amount-final">
            <span>{{ tranAmount.final }}</span>
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import {capitalizedAmount} from "xijs";
import {prompt} from "../../stores/tool/CustomTool";

export default {
  name: "chineseMoneyUnit",
  data() {
    return {
      tranAmount: {
        tobe: "",  // 代转写金额
        final: ""     // 转大写金额
      }
    }
  },
  methods: {
    formatAmount(value) {
      if (!value) return "";
      value = value.match(/(\d+\.?\d{0,2})/)[0];
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    parserAmount(value) {
      value = value.toString().replace(/(,*)/g, '');
      if (!value) return "";
      let match = value.match(/(\d+\.?\d{0,2})/);
      return match.length > 0 ? match[0] : "";
    },
    TranAmount(newVal) {
      if (newVal) {
        this.tranAmount.final = capitalizedAmount(newVal);
      } else {
        this.tranAmount.final = "";
      }
    },
    /* 复制 */
    copy(content) {
      if (!content) {
        console.error("复制内容为空");
        return;
      }
      navigator.clipboard.writeText(content);
      prompt({
        type: "success",
        content: "复制成功",
      })
    }
  },
  watch: {
    "tranAmount.tobe": {
      deep: true,
      handler: function (newVal, oldVal) {
        if (999999999999.99 >= newVal >= 0.01) {
          this.TranAmount(newVal, oldVal);
        } else {
          this.tranAmount.tobe = oldVal;
          prompt({type: "error", content: "请输入有效值"})
        }

      }
    }
  },
  beforeCreate() {
    document.title = "人民币大写转换-在线工具";
  },
  mounted() {
    // this.tranAmount.tobe = "188.8";
  }
}
</script>

<style scoped>
/* 内容框 */
.content-bar {
  width: 900px;
  height: 300px;
  min-height: 400px;
  background-color: #C4E1C5;
  border-radius: 30px;
  /* 卡片阴影效果 */
  box-shadow: 1px 1px 1px 3px rgba(0, 0, 0, 0.15);
  /*background: url("../background.jpg");*/
}

.content-bar > div {
  display: grid;
  place-items: center;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

/* 标题栏 */
.title {
  margin-bottom: 30px;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
}

.amount-column {
  display: inline-block;
}

.amount-column * {
  height: 50px;
  font-size: 25px;
  margin-top: 20px;
}

.tran-amount-final {
  font-weight: bold;
}

.tran-amount-final :hover {
  /* 添加下划虚线 (实线：solid 虚线：dotted) */
  text-decoration: underline dotted;
  /* 添加小手样式 */
  cursor: pointer;
}
</style>