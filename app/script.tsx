export default function Script() {
  return (
    <script
      type="text/javascript"
      src={`http://api.map.baidu.com/api?v=3.0&ak=mzBY3pLQTnguP3a9yriGkb3sRPoidbNE&callback=initBaiduMap`}
      async
      defer
    ></script>
  );
}
