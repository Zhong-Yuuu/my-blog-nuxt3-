<template>
  <div class="login-container">
    <div class="ring">
      <span style="--clr: #00ff0a"></span>
      <span style="--clr: #ff0057"></span>
      <span style="--clr: #fffd44"></span>

      <a-form class="login-form" layout="vertical">
        <h2 class="login-title">登录</h2>

        <a-form-item>
          <a-row>
            <a-col :span="24" class="custom-input-wrapper">
              <input
                type="text"
                class="custom-input"
                placeholder=""
                v-model="form.username"
                id="admin"
              />
              <label for="admin" class="custom-label">Admin</label>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-row>
            <a-col :span="24" class="custom-input-wrapper">
              <input
                type="password"
                class="custom-input"
                placeholder=" "
                v-model="form.password"
                id="password"
              />
              <label for="password" class="custom-label">Password</label>
            </a-col>
          </a-row>
        </a-form-item>

        <div class="login-btn-wrap">
          <button type="submit" class="login-btn" @click="handleLogin">
            登录
          </button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  clientOnly: true,
});

const form = ref({ username: "", password: "" });
const router = useRouter();
const route = useRoute();

const { initThemeByTime } = useTheme();
initThemeByTime();

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    Message.warning({
      content: "请输入用户名/密码",
      duration: 2000,
    });
    return;
  }

  try {
    // 调用封装的 POST 请求
    const res = await usePost("/login", {
      username: form.value.username,
      password: form.value.password,
    });

    // 登录成功逻辑
    localStorage.setItem("adminId", res.data.id);
    router.push("/");
  } catch (error) {
    console.error("登录失败", error);
  }
};
</script>

<style lang="less" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  // ✅ 兜底值改为白色（白天优先，变量未生效时不显示黑色）
  background-color: var(--global-bg, #ffffff);
}

.ring {
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--transition-base);

  &:hover span {
    border: 6px solid var(--clr);
    filter: drop-shadow(0 0 20px var(--clr));
  }

  span {
    position: absolute;
    border: 2px solid var(--global-text);
    inset: 0;
    transition: var(--transition-base);
  }

  .login-form {
    position: absolute;
    width: 300px;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--global-text);
  }

  span:nth-child(1) {
    border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
    animation: animate 6s linear infinite;
  }
  span:nth-child(2) {
    border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%;
    animation: animate 4s linear infinite;
  }
  span:nth-child(3) {
    border-radius: 41% 44% 56% 59% / 38% 62% 63% 37%;
    animation: animate 10s linear infinite reverse;
  }
}

.login-title {
  font-size: 32px;
  letter-spacing: 16px;
  text-align: center;
  margin-bottom: 16px;
}

.login-btn-wrap {
  width: 100%;
}

.login-btn {
  width: 100%;
  padding: 12px 20px;
  border-radius: var(--input-border-radius);
  background: linear-gradient(45deg, #ff357a, #fff172);
  color: var(--label-color);
  font-size: 18px;
  cursor: pointer;
  transition: var(--transition-base);

  &:hover {
    background: linear-gradient(45deg, #fff172, #ff357a);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

@keyframes animate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

:deep(.arco-row.arco-row-align-start.arco-row-justify-start) {
  width: 300px;
}
</style>