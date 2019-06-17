# -- coding: utf-8 --
import sys
import time
import cv2 as cv
# add objection detection to system path
sys.path.append("/usr/local/lib/python2.7/dist-packages/tensorflow/models/research/object_detection")
import my_object_detection as detect
# 导入当前文件所在目录
import os
CUR_PATH = os.path.split(os.path.realpath(__file__))[0]
# print CUR_PATH # should be /home/robot/CatCamera_Master/server/imgprocess_module

# the shape of img after resize
# decreasing in size will lead to shorter processing time, but too small size may result in failure
RESIZE_WIDTH = 500
RESIZE = False

def Recog_and_AddHat(imagename,hattype):
	#识别模块
	img = cv.imread(CUR_PATH + '/../upload_files/' + imagename)
	if RESIZE:
		RESIZE_HEIGHT=(RESIZE_WIDTH/img.shape[1])*img.shape[0]
		img = cv.resize(img, (RESIZE_WIDTH, RESIZE_HEIGHT))

	# gray=cv.cvtColor(img,cv.COLOR_BGR2GRAY)
	# 调用函数识别猫脸，返回猫脸框的四个点的比例
	start = time.clock()
        (y_min_ratio, x_min_ratio, y_max_ratio, x_max_ratio) = detect.one_face_detection(img)
	end = time.clock()
        
	# print out test information
	print("image shape: {}".format(img.shape))
	print("Tensorflow running time: %s seconds" %(end-start))
	# print x_min_ratio,x_max_ratio,y_min_ratio,y_max_ratio
	
	if(x_min_ratio == 1): # 识别失败
		return 0 , img
	# 从比例计算实际坐标
	img_w = img.shape[1]
	img_h = img.shape[0]
	x = int(x_min_ratio*img_w)
	y = int(y_min_ratio*img_h)
	w = int((x_max_ratio-x_min_ratio)*img_w)
	h = int((y_max_ratio-y_min_ratio)*img_h)
	# print x, y, w, h
	
	cv.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
	
	#加帽子模块
	hatname='Christmas_Hat.png'
	hat_w_factor=0.65
	
	if(hattype=='Wizard_Hat'):
		hatname="Wizard_Hat.png"
		hat_w_factor=0.7
	elif(hattype=='Cowboy_Hat'):
		hatname="Cowboy_Hat.png"
		hat_w_factor=0.9
	elif(hattype=='Magician_Hat'):
		hatname="Magician_Hat.png"
		hat_w_factor=0.7
	elif(hattype=='Chief_Hat'):
		hatname="Chief_Hat.png"
		hat_w_factor=0.7

	hat = cv.imread(CUR_PATH + "/../imgprocess_module/" + hatname, -1) # 第二个参数为-1时才能读入Alpha通道

	r,g,b,a = cv.split(hat)
	hat_rgb = cv.merge((r,g,b))
	#cv.imwrite("rgb.jpg",hat_rgb)

	original_hat_w = hat.shape[1]
	original_hat_h = hat.shape[0]

	# 调节帽子和框出来的脸的大小比例关系
	fitted_hat_w = int(round(hat_w_factor*w))
	fitted_hat_h = int(round(original_hat_h*fitted_hat_w/original_hat_w))
	if fitted_hat_h > y:
		fitted_hat_h = y - 1

	# print hat_rgb.shape
	# print fitted_hat_w, fitted_hat_h
	fitted_hat = cv.resize(hat_rgb,(fitted_hat_w,fitted_hat_h))
	mask = cv.resize(a,(fitted_hat_w,fitted_hat_h))
	mask_inv = cv.bitwise_not(mask)

	#选出需要加帽子的区域并把它抠掉
	dy = 0
	x_factor = 0.65
	y_low = int(y-dy-fitted_hat_h)
	y_high = int(y-dy)
	x_low = int(x+int((w-fitted_hat_w)*x_factor))
	x_high = int(x+int((w-fitted_hat_w)*x_factor)+fitted_hat_w)
	# print y_low, y_high, x_low, x_high
	bg_ROI = img[y_low:y_high, x_low:x_high]

	bg_ROI = bg_ROI.astype(float)
	mask_inv = cv.merge((mask_inv,mask_inv,mask_inv))
	alpha = mask_inv.astype(float)/255

	alpha = cv.resize(alpha,(bg_ROI.shape[1],bg_ROI.shape[0]))
	bg = cv.multiply(alpha,bg_ROI)
	bg = bg.astype('uint8')

	#制作帽子
	hat = cv.bitwise_and(fitted_hat,fitted_hat,mask=mask)
	hat = cv.resize(hat,(bg.shape[1],bg.shape[0]))

	hat_added = cv.add(bg,hat)

	#更改原图中的区域
	img[y_low:y_high, x_low:x_high] = hat_added

	return 1, img


if __name__=='__main__':
	start = time.clock()

	# 读取照片路径
	imagename = sys.argv[1]
	hattype=sys.argv[2]	
	# 调用识别函数，接收识别结果和处理后的图像	
	facedetected, imgprocessed = Recog_and_AddHat(imagename,hattype)
	# 如果识别成功，则保存图像
	if(facedetected == 1):
		cv.imwrite(CUR_PATH + '/../download_files/' + imagename, imgprocessed)
	
	end = time.clock()
	print("Imgprocess_module running time: %s seconds" %(end-start))

	print(facedetected)  # 返回给server做判断的，误删


