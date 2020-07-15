/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:3306
 Source Schema         : management

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 12/03/2020 16:03:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attrs
-- ----------------------------
DROP TABLE IF EXISTS `attrs`;
CREATE TABLE `attrs`  (
  `attr_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类参数ID',
  `attr_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类参数名称',
  `cat_id` int(10) NOT NULL COMMENT '分类参数所属分类',
  `attr_sel` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'only:输入框(唯一) many:后台下拉列表/前台单选框',
  `attr_write` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'manual:手工录入 list:从列表选择',
  `attr_vals` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '如果 attr_write:list,那么有值，该值以逗号分隔',
  PRIMARY KEY (`attr_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of attrs
-- ----------------------------
INSERT INTO `attrs` VALUES (1, '测试', 1, 'many', 'list', '8989,898');
INSERT INTO `attrs` VALUES (2, '测试参数2', 1, 'only', 'manual', NULL);
INSERT INTO `attrs` VALUES (3, '测试参数', 1, 'many', 'list', '4 4 4 4');
INSERT INTO `attrs` VALUES (5, '测试参数', 1, 'only', 'manual', '');
INSERT INTO `attrs` VALUES (6, '测试参数', 1, 'many', 'list', '555');
INSERT INTO `attrs` VALUES (7, '规划局1', 11, 'many', 'list', '489 对方是个 豆腐');
INSERT INTO `attrs` VALUES (8, '烦烦烦1', 11, 'only', 'manual', NULL);
INSERT INTO `attrs` VALUES (11, '豆腐', 11, 'many', 'list', '的手续费');
INSERT INTO `attrs` VALUES (12, '变频', 24, 'many', 'list', '11 55');
INSERT INTO `attrs` VALUES (13, 'hz', 24, 'only', 'manual', NULL);

-- ----------------------------
-- Table structure for cats
-- ----------------------------
DROP TABLE IF EXISTS `cats`;
CREATE TABLE `cats`  (
  `cat_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `cat_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
  `cat_pid` int(10) NULL DEFAULT NULL COMMENT '分类父ID',
  `cat_level` tinyint(1) NOT NULL COMMENT '分类当前层级(0为一级,1为二级,2为三级)',
  `cat_deleted` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类是否已删除',
  PRIMARY KEY (`cat_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cats
-- ----------------------------
INSERT INTO `cats` VALUES (1, '家电', NULL, 0, 'false');
INSERT INTO `cats` VALUES (2, '冰箱', 1, 1, 'false');
INSERT INTO `cats` VALUES (3, '双开门冰箱', 2, 2, 'true');
INSERT INTO `cats` VALUES (4, '电视', 1, 1, 'false');
INSERT INTO `cats` VALUES (6, '长虹', 4, 2, 'fakse');
INSERT INTO `cats` VALUES (8, 'r\'t\'d\'s\'t\'g', 4, 2, 'true');
INSERT INTO `cats` VALUES (9, '阿斯蒂芬', 0, 0, 'true');
INSERT INTO `cats` VALUES (10, '电费滚滚', 2, 2, 'true');
INSERT INTO `cats` VALUES (11, '撒地方', 2, 2, 'true');
INSERT INTO `cats` VALUES (12, '撒地方', 2, 2, 'true');
INSERT INTO `cats` VALUES (13, '发电公司', 1, 1, 'true');
INSERT INTO `cats` VALUES (14, '的风格', 2, 2, 'true');
INSERT INTO `cats` VALUES (15, '的分公司', 9, 1, 'false');
INSERT INTO `cats` VALUES (16, '第三个', 9, 1, 'false');
INSERT INTO `cats` VALUES (17, '二娃夫人', NULL, 0, 'true');
INSERT INTO `cats` VALUES (18, '当时法国', 17, 1, 'false');
INSERT INTO `cats` VALUES (19, '厨用工具', 0, 0, 'false');
INSERT INTO `cats` VALUES (20, '锅铲', 19, 1, 'false');
INSERT INTO `cats` VALUES (21, '药物', 0, 0, 'false');
INSERT INTO `cats` VALUES (22, '胶囊类', 21, 1, 'false');
INSERT INTO `cats` VALUES (23, '中药类', 21, 1, 'false');
INSERT INTO `cats` VALUES (24, '海尔冰箱', 2, 2, 'false');
INSERT INTO `cats` VALUES (25, '长虹', 4, 2, 'false');
INSERT INTO `cats` VALUES (26, '铁勺', 20, 2, 'false');
INSERT INTO `cats` VALUES (27, '阿莫西林', 22, 2, 'true');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `goods_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品 ID',
  `goods_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品名称',
  `goods_cat` int(10) NOT NULL COMMENT '以为\',\'分割的分类列表',
  `goods_price` decimal(10, 2) NOT NULL COMMENT '价格',
  `goods_number` int(10) NOT NULL COMMENT '数量',
  `goods_weight` decimal(10, 2) NOT NULL COMMENT '重量',
  `goods_state` tinyint(1) NULL DEFAULT NULL COMMENT '商品状态 0: 未通过 1: 审核中 2: 已审核',
  `add_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '添加时间',
  `upd_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '更新时间',
  `hot_mumber` int(10) NULL DEFAULT 0 COMMENT '热销品数量',
  `is_promote` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '0' COMMENT 'false代表不是,true代表是',
  `goods_introduce` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '商品介绍',
  `pics` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '商品上传的图片临时路径（对象）',
  `attrs` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '商品的参数',
  PRIMARY KEY (`goods_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (1, '1212', 1, 1.00, 1, 122.00, NULL, '1582701102080', '1582701102080', 0, 'false', '一部手机', NULL, NULL);
INSERT INTO `goods` VALUES (2, '商品名称', 3, 1.00, 1, 1.00, NULL, '1582701102080', '1582701102080', 0, 'false', '', '', '');
INSERT INTO `goods` VALUES (5, '商品名称', 3, 1.00, 1, 1.00, NULL, '1582710949082', '1582710949082', 0, 'false', '', '', '');
INSERT INTO `goods` VALUES (6, '海尔 （Haier）330升双变频风冷无霜四门冰箱三档变温空间DEO净味保鲜新国标一级节能 BCD-330WDPTU1', 24, 123.00, 12, 12.00, NULL, '1583893667913', '1583893667913', 0, 'false', '', '', '');

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `authName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路径',
  `pid` int(10) NULL DEFAULT NULL COMMENT '父菜单id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (1, '用户管理', '00', NULL);
INSERT INTO `menus` VALUES (2, '用户列表', 'users', 1);
INSERT INTO `menus` VALUES (3, '权限管理', '11', NULL);
INSERT INTO `menus` VALUES (4, '角色列表', 'roles', 3);
INSERT INTO `menus` VALUES (5, '权限列表', 'rights', 3);
INSERT INTO `menus` VALUES (6, '商品管理', '22', NULL);
INSERT INTO `menus` VALUES (7, '商品列表', 'goods', 6);
INSERT INTO `menus` VALUES (8, '分类参数', 'params', 6);
INSERT INTO `menus` VALUES (9, '商品分类', 'categories', 6);
INSERT INTO `menus` VALUES (10, '订单管理', '33', NULL);
INSERT INTO `menus` VALUES (11, '订单列表', 'orders', 10);
INSERT INTO `menus` VALUES (12, '数据统计', '44', NULL);
INSERT INTO `menus` VALUES (13, '数据报表', 'reports', 12);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户 ID',
  `pay_status` tinyint(1) NULL DEFAULT NULL COMMENT '支付状态(0为未支付,1为已支付)',
  `is_send` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否发货',
  `add_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '下单时间',
  `order_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '订单编号',
  `order_price` decimal(10, 2) NOT NULL COMMENT '订单价格',
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, 1, 0, 'false', '1582701102080', 'nishop-59e7502d7993d', 121.00);
INSERT INTO `orders` VALUES (2, 1, 0, 'true', '1582701108949', 'nishop-59e7502d7993f', 121.00);

-- ----------------------------
-- Table structure for rights
-- ----------------------------
DROP TABLE IF EXISTS `rights`;
CREATE TABLE `rights`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `authName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '路径',
  `level` tinyint(1) NOT NULL COMMENT '权限等级(0为一级,1为二级,2为三级)',
  `pid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限父id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rights
-- ----------------------------
INSERT INTO `rights` VALUES (1, '商品管理', 'goods', 0, NULL);
INSERT INTO `rights` VALUES (2, '订单管理', 'orders', 0, NULL);
INSERT INTO `rights` VALUES (3, '权限管理', 'rights', 0, NULL);
INSERT INTO `rights` VALUES (4, '商品列表', 'goods', 1, '1');
INSERT INTO `rights` VALUES (5, '添加商品', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (6, '订单列表', 'orders', 1, '2');
INSERT INTO `rights` VALUES (7, '添加订单', 'orders', 2, '2,6');
INSERT INTO `rights` VALUES (8, '用户管理', 'users', 0, NULL);
INSERT INTO `rights` VALUES (9, '用户列表', 'users', 1, '8');
INSERT INTO `rights` VALUES (10, '权限列表', 'rights', 1, '3');
INSERT INTO `rights` VALUES (11, '角色列表', 'roles', 1, '3');
INSERT INTO `rights` VALUES (12, '分类参数', 'params', 1, '1');
INSERT INTO `rights` VALUES (13, '商品修改', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (14, '商品删除', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (15, '商品分类', 'categories', 1, '1');
INSERT INTO `rights` VALUES (16, '添加分类', 'categories', 2, '1,15');
INSERT INTO `rights` VALUES (17, '删除分类', 'categories', 2, '1,15');
INSERT INTO `rights` VALUES (18, '添加角色', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (19, '删除角色', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (20, '添加用户', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (21, '删除用户', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (22, '更新用户', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (23, '角色授权', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (24, '取消角色授权', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (25, '获取用户详情', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (26, '分配用户角色', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (27, '获取角色列表', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (28, '获取角色详情', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (29, '更新角色信息', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (30, '更新角色权限', 'roles', 2, '3,11');
INSERT INTO `rights` VALUES (31, '获取参数列表', 'params', 2, '1,12');
INSERT INTO `rights` VALUES (32, '创建商品参数', 'params', 2, '1,12');
INSERT INTO `rights` VALUES (33, '删除商品参数', 'params', 2, '1,12');
INSERT INTO `rights` VALUES (34, '数据统计', 'report', 0, NULL);
INSERT INTO `rights` VALUES (35, '数据报表', 'report', 1, '34');
INSERT INTO `rights` VALUES (36, '查看权限', 'rights', 2, '3,10');
INSERT INTO `rights` VALUES (37, '查看数据', 'reports', 2, '34,35');
INSERT INTO `rights` VALUES (38, '获取分类详情', 'categories', 2, '1,15');
INSERT INTO `rights` VALUES (39, '更新商品图片', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (41, '更新商品属性', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (44, '更新商品状态', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (45, '获取商品详情', 'goods', 2, '1,4');
INSERT INTO `rights` VALUES (46, '订单更新', 'orders', 2, '2,6');
INSERT INTO `rights` VALUES (47, '获取订单详情', 'orders', 2, '2,6');
INSERT INTO `rights` VALUES (48, '分类参数添加', 'categories', 2, '1,12');
INSERT INTO `rights` VALUES (49, '分类参数删除', 'categories', 2, '1,12');
INSERT INTO `rights` VALUES (50, '分类参数详情', 'categories', 2, '1,12');
INSERT INTO `rights` VALUES (51, '设置管理状态', 'users', 2, '8,9');
INSERT INTO `rights` VALUES (55, '查看数据', 'reports', 2, '35,36');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `roleId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `roleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `roleDesc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色描述',
  `rids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '角色拥有的权限',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '超级管理员', '最大的管理者', '5,13,14,1,4');
INSERT INTO `roles` VALUES (2, '管理员', '管理者', '1,4,5,13,14,39,41,44,12,31,32,33,48,49,15,16,17,38,2,6,7,46,47,10,36,11,18,19,23,27,28,29,8,9,20,21,22,51,35,37');
INSERT INTO `roles` VALUES (11, '低级管理员', 'low', '1,4,5');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '邮箱',
  `mobile` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `rid` int(10) NULL DEFAULT NULL COMMENT '角色id',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户状态(false为关闭,true为开启)',
  `create_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建时间',
  `is_delete` tinyint(1) NOT NULL COMMENT '是否已删除(0为未删除,1为已删除)',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '222@qq.com', '12333211234', 1, 'true', '2020.02.20', 0, '123456');
INSERT INTO `users` VALUES (2, 'admin1', '222@qq.com', '12333211233', 1, 'true', '2020-02-22 13:47:54.700', 0, '13245');
INSERT INTO `users` VALUES (3, 'admin2', '11111@qq.com', '11111111111', 1, 'false', '2020-02-22 13:51:44.621', 0, '13245');
INSERT INTO `users` VALUES (5, 'dsaf', 'asdf@qq.com', '12345678998', 1, 'true', '2020-02-26 16:20:37.592', 0, 'asdfa');
INSERT INTO `users` VALUES (6, 'sadf', 'sadf@qq.com', '12311121332', 1, 'true', '2020-02-26 16:20:53.882', 0, 'sadf');

SET FOREIGN_KEY_CHECKS = 1;
