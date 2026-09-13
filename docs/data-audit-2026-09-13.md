# 数据与代码核对记录 · 2026-09-13

## 范围与结论

- 检查 90 位运动员的 ID、主项、相关人物引用和风格评分范围，以及 109 条比赛记录的结构、日期、成绩单位与来源。
- 79 条 2026 年上海/柯桥、厦门站记录以项目原有的两篇官方赛后报道为核对依据；修正两条把 300 米栏写成 400 米栏的记录。
- 30 条历史记录重新查找世界田联具体结果页、纪录报道或赛事统计，替换无法追溯到单场比赛的网站首页链接。来源链接保存在每条记录中。
- 比赛记录仍只覆盖已收录的赛事，2026 年钻石联赛收录截至 5 月 23 日；本次核对不是补齐全年赛事。资料核对日期与比赛覆盖日期分开显示。
- 人物故事、荣誉概述、图片身份与全部个人档案中的旧 PB/SB 字段未逐条重新做外部事实核验；风格评分属于编辑解读，页面已注明。页面成绩概览只使用比赛记录。

## 修正的主要事实

| 记录 | 修正 |
| --- | --- |
| 2026 上海/柯桥 dos Santos、Warholm | 33.01 / 33.05 是 300 米栏，不是 400 米栏 |
| Lyles 2023 世锦赛百米 | 日期由 8 月 25 日改为 8 月 20 日 |
| Richardson 2024 奥运会百米决赛 | 10.71 改为 10.87，删除错误 SB 标记 |
| Kipyegon 2024 奥运会 1500 米 | 保留奥运纪录，删除错误 PB 标记 |
| Mahuchikh 2024 奥运会跳高 | 2.10 改为 2.00，删除该场比赛不具备的 WR/PB/OR 标记 |
| Chopra 2024 奥运会标枪决赛 | 89.34 改为 89.45 |
| Duplantis 6.30 米 | 赛事由 2025 杭州钻石联赛改为 2025-09-15 东京世锦赛 |
| Duplantis 6.31 米 | 赛事由南京室内世锦赛改为 2026-03-12 乌普萨拉 Mondo Classic |
| Fraser-Pryce 2022 世锦赛百米 | WL 改为官方结果中的 CR |
| Kerr 2023 世锦赛、El Bakkali 2024 奥运会 | 补充官方 SB 标记 |

## 防止问题重复出现

- 分秒、时分秒完整换算为秒；不再用 parseFloat 把 7:25.77 变成 7。
- 已收录 PB 按项目去重并优先显示主项；跳跃、投掷取较高成绩，径赛取较低成绩。
- SB 只用于对应赛季，不再把 2024 年记录当作 2026 年赛季最佳。
- 加入重复 ID、无效日期、断开的运动员引用、单位不一致与首页来源链接的校验。
- 合并三处成绩解析和对比页两栏重复代码；删除无引用工具、转发组件和旧分页工具，停止跟踪编译缓存。
- 后端读取数据失败明确报错；修正项目成绩查询使用中文名称导致结果为空、排序修改缓存和分页参数错误。
- 测试只读取源文件，避免 server/dist 中的编译副本重复运行。

## 历史记录的具体核对来源

| 记录 ID | 官方来源 |
| --- | --- |
| noah-lyles-20240804-100m | [World Athletics](https://worldathletics.org/competitions/olympic-games/paris-7153115/results/men/100-metres/final/result) |
| noah-lyles-20230820-100m | [World Athletics](https://worldathletics.org/en/competitions/world-athletics-championships/world-athletics-championships-budapest-2023-7138987/news/report/wch-budapest-23-report-men-100m) |
| noah-lyles-20220721-200m | [World Athletics](https://worldathletics.org/results/world-athletics-championships/2022/world-athletics-championships-oregon22-7137279/men/200-metres/final/result) |
| sha-carri-richardson-20230821-100m | [World Athletics](https://worldathletics.org/en/competitions/world-athletics-championships/world-athletics-championships-budapest-2023-7138987/news/report/wch-budapest-23-report-women-100m) |
| sha-carri-richardson-20240803-100m | [World Athletics](https://worldathletics.org/competitions/olympic-games/the-xxxiii-olympic-games-7153115/results/women/100-metres/final/result) |
| fred-kerley-20220716-100m | [World Athletics](https://worldathletics.org/results/world-athletics-championships/2022/world-athletics-championships-oregon-2022-7137279/men/100-metres/final/result) |
| shelly-ann-fraser-pryce-20220717-100m | [World Athletics](https://worldathletics.org/results/world-athletics-championships/2022/world-athletics-championships-oregon-2022-7137279/women/100-metres/final/result) |
| letsile-tebogo-20240808-200m | [World Athletics](https://worldathletics.org/news/feature/paris-2024-olympics-report-men-200m) |
| sydney-mclaughlin-levrone-20240808-400mh | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/women/400-metres-hurdles/final/result) |
| sydney-mclaughlin-levrone-20220722-400mh | [World Athletics](https://worldathletics.org/competitions/world-athletics-championships/oregon22-7137279/results/women/400-metres-hurdles/final/result) |
| femke-bol-20230824-400mh | [World Athletics](https://worldathletics.org/results/world-athletics-championships/2023/world-athletics-championships-budapest-2023-7138987/women/400-metres-hurdles/final/result) |
| rai-benjamin-20240809-400mh | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/400-metres-hurdles/final/result) |
| grant-holloway-20240808-110mh | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/110-metres-hurdles/final/result) |
| jakob-ingebrigtsen-20240806-1500m | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/1500-metres/final/result) |
| jakob-ingebrigtsen-20240810-5000m | [World Athletics](https://worldathletics.org/competitions/olympic-games/the-xxxiii-olympic-games-7153115/news/article/paris-2024-olympics-report-men-5000m) |
| faith-kipyegon-20240810-1500m | [World Athletics](https://worldathletics.org/news/report/paris-2024-olympics-report-women-1500m) |
| josh-kerr-20230823-1500m | [World Athletics](https://worldathletics.org/competitions/world-athletics-championships/world-athletics-championships-budapest-2024-7138987/results/men/1500-metres/final/result) |
| sifan-hassan-20240811-marathon | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/women/marathon/final/result) |
| soufiane-el-bakkali-20240807-3000msc | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/3000-metres-steeplechase/final/result) |
| emmanuel-wanyonyi-20240810-800m | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/800-metres/final/result) |
| mondo-duplantis-20240805-pole-vault | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/pole-vault/final/result) |
| mondo-duplantis-20240825-pole-vault | [World Athletics](https://worldathletics.org/records/competition-performance-rankings/ranking/633698) |
| mondo-duplantis-20250915-pole-vault | [World Athletics](https://worldathletics.org/competitions/world-athletics-championships/world-athletics-championships-tokyo-2025-7190593/results/men/pole-vault/final/result) |
| mondo-duplantis-20260312-pole-vault | [World Athletics](https://worldathletics.org/news/report/duplantis-breaks-world-pole-vault-record-in-uppsala) |
| yaroslava-mahuchikh-20240804-high-jump | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/women/high-jump/final/result) |
| yulimar-rojas-20210801-triple-jump | [World Athletics](https://worldathletics.org/results/olympic-games/2021/the-xxxii-olympic-games-athletics-7132391/women/triple-jump/final/result) |
| neeraj-chopra-20240808-javelin | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/men/javelin-throw/final/result) |
| karsten-warholm-20210803-400mh | [World Athletics](https://worldathletics.org/results/olympic-games/2021/the-xxxii-olympic-games-7132391/men/400-metres-hurdles/final/result) |
| tobi-amusan-20220724-100mh | [World Athletics](https://worldathletics.org/competitions/world-athletics-championships/world-athletics-championships-oregon-2022-7137279/results/women/100-metres-hurdles/semi-final/summary) |
| valarie-allman-20240805-discus | [World Athletics](https://worldathletics.org/results/olympic-games/2024/the-xxxiii-olympic-games-7153115/women/discus-throw/final/result) |

2026 年赛事来源：[上海/柯桥官方报道](https://www.diamondleague.com/schilder-makes-history-in-keqiao/)、[厦门官方报道](https://www.diamondleague.com/russell-and-yan-break-diamond-league-records-in-xiamen/)。
