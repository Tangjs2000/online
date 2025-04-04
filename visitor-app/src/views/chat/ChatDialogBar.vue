<template>
  <div id="dialogMsgBar" class="dialogMsgBar">
    <!-- 系统公告 -->
    <t-notice-bar v-if="notice?.show && notice?.content?.length > 0" class="sys_notice"
                  visible marquee direction="vertical" :content="notice?.content">
      <template #prefixIcon>
        <SoundIcon/>
      </template>
      <template #suffixIcon>
        <CloseIcon @click="noticeClose"/>
      </template>
    </t-notice-bar>
    <!-- 查看历史消息 -->
    <div id="viewHistoryChat" class="dialog">
      <button id="gainHistoryChat">查看历史消息</button>
    </div>
    <!-- 历史消息 -->
    <div id="historyChat"></div>
    <!-- 历史消息分割线 -->
    <div id="historyDivider" class="dialogV2">
      <div class="systemCard">
        <div class="cross-mark">
          <span style="margin:0 10px">以下是新消息</span>
        </div>
      </div>
    </div>
    <!-- 新消息(最新会话消息) -->
    <div id="newChat">
      <!-- 撤回消息 todo 本人撤回和对方撤回 不同展示处理-->
      <div id="revoke" class="dialogV2">
        <div class="systemCard">你撤回了一条消息
          <span style="color: darkorange;margin: 0 5px" @click="reEdit('123123')">重新编辑</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {SoundIcon, CloseIcon} from 'tdesign-icons-vue-next';

export default {
  name: "ChatDialogBar",
  components: {
    SoundIcon,
    CloseIcon
  },
  props: {
    notice: {
      type: Object,
      default: () => {
        return {
          show: false,
          content: []
        }
      }
    },
    modelValue: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  emits: ['reEdit', 'revoke', 'update:notice'],
  data() {
    return {
      /*notice: {
        show: false,
        content: []
      }*/
    }
  },
  watch: {
    /*"notice": {
      deep: true,
      handler: function (notice) {
        this.notice = notice
      }
    }*/
  },
  methods: {
    noticeClose() {
      this.$emit('update:notice', {show: false, content: []});
    },
    /**
     * 重新编辑
     *
     * @author jiashuai.tang
     * @since 2025/04/02
     */
    reEdit() {
      this.$emit('reEdit', '123123');
    },
    /**
     * 撤回消息
     *
     * @param mid 消息编号
     * @author jiashuai.tang
     * @since 2025/04/02
     */
    revoke(mid) {
      this.$emit('revoke', mid);
    }
  }
}
</script>

<style scoped>
@import "../../assets/chat/online-app.css";
</style>